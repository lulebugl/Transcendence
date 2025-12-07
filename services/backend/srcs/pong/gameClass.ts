
let count: number = 0;
import WebSocket from 'ws';
import {
  START_BALL_X,
  START_BALL_Y,
  START_BALL_Z,
  TERRAIN_LIMIT_X_MIN,
  TERRAIN_LIMIT_X_MAX,
  TERRAIN_LIMIT_Z_MIN,
  TERRAIN_LIMIT_Z_MAX,
  PADDLE_WIDTH,
  BALL_SPEED
} from './ConstVarGameLogic';

export const startPaddleRightX: number = 0;
export const startPaddleRightY: number = 1.5;
export const startPaddleRightZ: number = 7.5;

export const startPaddleLeftX: number = 0;
export const startPaddleLeftY: number = 1.5;
export const startPaddleLeftZ: number = -7.5;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function InfoInGame(
  id = 0,
  ballx = START_BALL_X, bally = START_BALL_Y, ballz = START_BALL_Z,
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
  private id: string;
  private players: WebSocket[];
  private state: any;
  private loop: any;
  private sceneIsReadyLeft: boolean;
  private sceneIsReadyRight: boolean;
  private PauseFlag: boolean = false;
  private speedMemory: number = 0;

  constructor(id, player1, player2) {
    this.id = id;
    this.players = [player1, player2];
    this.state = InfoInGame(id);
    this.sceneIsReadyLeft = false;
    this.sceneIsReadyRight = false;
    // ascolta i messaggi dei due client
    //TODO: setto la camera per i player

    this.players.forEach((ws, i) => {
      ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        this.updateKey(data, i);
      });
    });

    this.startTimer();
  }

  startTimer() {
    let countdown = 10;
    // Send initial 3

    const interval = setInterval(() => {
      if (this.sceneIsReadyLeft && this.sceneIsReadyRight) {
        countdown--;

        if (countdown < 0) {
          clearInterval(interval);
          this.loop = setInterval(() => this.update(), 32);
        } else {

          this.broadcast({ type: 'timer', count: countdown });
        }
      }
    }, 1000);
  }
  updateKey(msg, playerIndex) {
    console.log(msg);
    const info = msg;
    let paddle = playerIndex === 0 ? this.state.paddleRight : this.state.paddleLeft;
    const keyRight = playerIndex === 0 ? 'a' : 'd';
    const keyLeft = playerIndex === 0 ? 'd' : 'a';

    if (info.type === "playerMove" && info.key === keyLeft && paddle.position.x + 0.5 < TERRAIN_LIMIT_X_MAX)
      paddle.position.x += 0.5;
    else if (info.type === "playerMove" && info.key === keyRight && paddle.position.x - 0.5 > TERRAIN_LIMIT_X_MIN)
      paddle.position.x -= 0.5;
    else if (info.type === "ready") {
      if (playerIndex === 0) {
        this.sceneIsReadyLeft = true;
        this.sendToClient({ type: "start", player: playerIndex + 1 }, playerIndex);
      }
      else {
        this.sceneIsReadyRight = true;
        this.sendToClient({ type: "start", player: playerIndex + 1 }, playerIndex);
      }
    }
    console.log(this.state, paddle);
  }
  // if (this.state.ball.position.x ==== START_BALL_X && this.state.ball.position.y === START_BALL_Y && this.state.ball.position.z === START_BALL_Z)
  // {
  //   this.state.ball.position.z = START_BALL_Z;
  // }
  sendToClient(message: any, playerIndex: number) {
    if (this.players[playerIndex]) {
      this.players[playerIndex].send(JSON.stringify(message));
    }
  }

  update() {
    if (this.PauseFlag) {
      if (this.speedMemory === 0)
        this.speedMemory = this.state.ball.speed;
      this.state.ball.speed = 0;
      if (this.areAllPlayersConnected()) {
        this.PauseFlag = false;
        this.state.ball.speed = this.speedMemory;
        this.speedMemory = 0;
        this.state.break = false;
      }
    }
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

  async resetBall() {
    this.state.ball.position.x = START_BALL_X;
    this.state.ball.position.z = START_BALL_Z;
    this.state.ball.speed = 0; // Stop the ball
    this.state.ball.angle = Math.PI / 2; // Point it straight up (or any fixed direction)

    await sleep(1000); // Wait for 2 seconds

    if (this.PauseFlag) {
      this.speedMemory = BALL_SPEED; // Store the speed to resume later
      this.state.ball.speed = 0;
    } else {
      this.state.ball.speed = BALL_SPEED; // Restart the ball
    }
    this.state.ball.angle = Math.random() < 0.5 ? Math.PI / 4 : 5 * Math.PI / 4; // Random direction
  }

  broadcast(data) {
    const msg = JSON.stringify(data);
    this.players.forEach(p => {
      if (p && p.readyState === WebSocket.OPEN)
        p.send(msg);
    });
  }
  areAllPlayersConnected(): boolean {
    return this.players.every(p => p && p.readyState === WebSocket.OPEN);
  }
  setCamera(players) {
    let id = 0;
    this.players.forEach(p => {
      if (p && p.readyState === WebSocket.OPEN) {
        ++id;
        const msg = JSON.stringify({ type: "start", player: id });
        p.send(msg);
      }
    });
  }
  setPauseFlags(flag: boolean) {
    this.PauseFlag = flag;
    this.state.break = flag;
    this.broadcast({ type: 'update', state: this.state });
    // sbatti
  }


  updatePlayerSocket(playerIndex: number, newSocket: WebSocket) {
    this.players[playerIndex] = newSocket;
    newSocket.on('message', (msg) => {
      try {
        const data = JSON.parse(msg as any);
        this.updateKey(data, playerIndex);
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    });
  }

  stop() {
    clearInterval(this.loop);
  }
}

