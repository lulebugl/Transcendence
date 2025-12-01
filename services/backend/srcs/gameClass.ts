
let count: number = 0;
import WebSocket from 'ws';
import {
  startBallX,
  startBallY,
  startBallZ,
  startPaddleRightX,
  startPaddleRightY,
  startPaddleRightZ,
  startPaddleLeftX,
  startPaddleLeftY,
  startPaddleLeftZ,
  TERRAIN_LIMIT_X_MIN,
  TERRAIN_LIMIT_X_MAX,
  TERRAIN_LIMIT_Y_MIN,
  TERRAIN_LIMIT_Y_MAX,
  TERRAIN_LIMIT_Z_MIN,
  TERRAIN_LIMIT_Z_MAX,
  PADDLE_WIDTH,
  BALL_SPEED
} from './ConstVarGameLogic';

function InfoInGame(
  id = 0,
  ballx = startBallX, bally = startBallY, ballz = startBallZ,
  p1x = startPaddleRightX, p1y = startPaddleRightY, p1z = startPaddleRightZ,
  p2x = startPaddleLeftX, p2y = startPaddleLeftY, p2z = startPaddleLeftZ,
  point2 = 0, point1 = 0,
  messageType = "Update",
  ballAngle = Math.PI / 4 // Initial angle
) {
  const message = {
    message: messageType,
    GamesID: id,
    ball: {
      position: { x: ballx, y: bally, z: ballz },
      angle: ballAngle,
      speed: BALL_SPEED
    },
    paddleRight: {
      position: { x: p1x, y: p1y, z: p1z },
      point: point1,
    },
    paddleLeft: {
      position: { x: p2x, y: p2y, z: p2z },
      point: point2,
    }
  };

  return (message);
}

export class Game {
  private id: any;
  private players: any;
  private state: any;
  private loop: any;

  constructor(id, player1, player2) {
    this.id = id;
    this.players = [player1, player2];
    this.state = InfoInGame(id);
    // ascolta i messaggi dei due client
    //TODO: setto la camera per i player

    this.players.forEach((ws, i) => {
      ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        this.updateKey(data, i);
      });
    });

    this.loop = setInterval(() => this.update(), 16);
  }
  updateKey(msg, playerIndex) {
    console.log(msg);
    const info = msg;
    let paddle = playerIndex === 0 ? this.state.paddleRight : this.state.paddleLeft;
    const keyRight = playerIndex === 0 ? 'a' : 'd';
    const keyLeft = playerIndex === 0 ? 'd' : 'a';

    if (info.type === "playerMove" && info.key === keyLeft && paddle.position.x > TERRAIN_LIMIT_X_MIN)
      paddle.position.x += 0.5;
    else if (info.type === "playerMove" && info.key === keyRight && paddle.position.x < TERRAIN_LIMIT_X_MAX)
      paddle.position.x -= 0.5;
    else if (info.type === "Not ready")
      this.setCamera(this.players)
    console.log(this.state, paddle);
  }
  // if (this.state.ball.position.x ==== START_BALL_X && this.state.ball.position.y === START_BALL_Y && this.state.ball.position.z === START_BALL_Z)
  // {
  //   this.state.ball.position.z = START_BALL_Z;
  // }

  update() {
    // Ball movement
    this.state.ball.position.x += Math.cos(this.state.ball.angle) * this.state.ball.speed;
    this.state.ball.position.z += Math.sin(this.state.ball.angle) * this.state.ball.speed;

    // Wall collision (X axis)
    if (this.state.ball.position.x <= TERRAIN_LIMIT_X_MIN || this.state.ball.position.x >= TERRAIN_LIMIT_X_MAX) {
      this.state.ball.angle = Math.PI - this.state.ball.angle;
    }

    // Paddle collision (Z axis)
    // Paddle Right (Positive Z)
    if (this.state.ball.position.z >= this.state.paddleRight.position.z - 0.5 && // Check depth
      this.state.ball.position.x >= this.state.paddleRight.position.x - PADDLE_WIDTH / 2 &&
      this.state.ball.position.x <= this.state.paddleRight.position.x + PADDLE_WIDTH / 2) {

      let relativeIntersectX = this.state.paddleRight.position.x - this.state.ball.position.x;
      let normalizedRelativeIntersectionX = (relativeIntersectX / (PADDLE_WIDTH / 2));
      let bounceAngle = normalizedRelativeIntersectionX * (Math.PI / 3); // Max bounce angle 60 degrees
      this.state.ball.angle = Math.PI + bounceAngle; // Reflect back towards negative Z
      this.state.ball.speed += 0.01; // Increase speed
    }

    // Paddle Left (Negative Z)
    if (this.state.ball.position.z <= this.state.paddleLeft.position.z + 0.5 && // Check depth
      this.state.ball.position.x >= this.state.paddleLeft.position.x - PADDLE_WIDTH / 2 &&
      this.state.ball.position.x <= this.state.paddleLeft.position.x + PADDLE_WIDTH / 2) {

      let relativeIntersectX = this.state.paddleLeft.position.x - this.state.ball.position.x;
      let normalizedRelativeIntersectionX = (relativeIntersectX / (PADDLE_WIDTH / 2));
      let bounceAngle = normalizedRelativeIntersectionX * (Math.PI / 3);
      this.state.ball.angle = -bounceAngle; // Reflect back towards positive Z
      this.state.ball.speed += 0.01; // Increase speed
    }

    // Scoring
    if (this.state.ball.position.z > TERRAIN_LIMIT_Z_MAX) {
      this.state.paddleLeft.point++;
      this.resetBall();
    } else if (this.state.ball.position.z < TERRAIN_LIMIT_Z_MIN) {
      this.state.paddleRight.point++;
      this.resetBall();
    }

    this.broadcast({ type: 'update', state: this.state });
  }

  resetBall() {
    this.state.ball.position.x = startBallX;
    this.state.ball.position.z = startBallZ;
    this.state.ball.speed = BALL_SPEED;
    this.state.ball.angle = Math.random() < 0.5 ? Math.PI / 4 : 5 * Math.PI / 4; // Random direction
  }

  broadcast(data) {
    const msg = JSON.stringify(data);
    this.players.forEach(p => {
      if (p.readyState === WebSocket.OPEN)
        p.send(msg);
    });
  }
  setCamera(players) {
    let id = 0;
    this.players.forEach(p => {
      if (p.readyState === WebSocket.OPEN) {
        ++id;
        const msg = JSON.stringify({ type: "start", player: id });
        p.send(msg);
      }
    });
  }


  stop() {
    clearInterval(this.loop);
  }
}

