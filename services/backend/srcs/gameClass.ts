
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
  TERRAIN_LIMIT_X,
  TERRAIN_LIMIT_Z
} from './ConstVarGameLogic';

/*
function InfoInGame(
  id = 0,
  ballx = startBallX, bally = startBallY, ballz = startBallZ,
  p1x = startPaddleRightX, p1y = startPaddleRightY, p1z = startPaddleRightZ,
  p2x = startPaddleLeftX, p2y = startPaddleLeftY, p2z = startPaddleLeftZ,
  point2 = 0, point1 = 0,
  messageType = "Update"
) {
  const message = {
    message: messageType,
    GamesID: id,
    ball: {
      position: { x: ballx, y: bally, z: ballz }
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
*/

function createStateMessage(id, ball, p1, p2, point1, point2, type = "Update") {
  return {
    message: type,
    GamesID: id,
    ball: {
      position: { x: ball.x, y: ball.y, z: ball.z }
    },
    paddleRight: {
      position: { x: p1.x, y: p1.y, z: p1.z },
      point: point1
    },
    paddleLeft: {
      position: { x: p2.x, y: p2.y, z: p2.z },
      point: point2
    }
  };
}

export class Game {

  players: any[];
  loop: NodeJS.Timeout;
  gameStarted = false;

  state = {
    id: 0,
    ball: { x: startBallX, y: startBallY, z: startBallZ },
    paddleRight: { x: startPaddleRightX, y: startPaddleRightY, z: startPaddleRightZ, point: 0 },
    paddleLeft:  { x: startPaddleLeftX,  y: startPaddleLeftY,  z: startPaddleLeftZ,  point: 0 }
  };

  ballSpeed = { x: 0.08, z: 0.12 };

  constructor(id, player1, player2) {
    this.state.id = id;
    this.players = [player1, player2];

    // Input listeners
    this.players.forEach((ws, i) => {
      ws.on('message', raw => {
        const msg = JSON.parse(raw);
        this.handleInput(msg, i);
      });
    });

    this.loop = setInterval(() => this.update(), 16);
  }

  startGame() {
    if (!this.gameStarted) {
      this.gameStarted = true;
      console.log("🎮 Game started!");
      this.broadcast({ message: "gameStart" });
    }
  }

  handleInput(data, index) {
    const paddle = index === 0 ? this.state.paddleRight : this.state.paddleLeft;

    if (data.type === "playerMove") {
      if (data.key === 'a') paddle.x -= 0.25;
      if (data.key === 'd') paddle.x += 0.25;
    }
  }

  resetBall() {
    this.state.ball.x = startBallX;
    this.state.ball.z = startBallZ;

    this.ballSpeed.x = (Math.random() * 0.1 + 0.08) * (Math.random() > 0.5 ? -1 : 1);
    this.ballSpeed.z = (Math.random() * 0.1 + 0.12) * (Math.random() > 0.5 ? -1 : 1);
  }

  update() {
    if (!this.gameStarted) return;

    let b = this.state.ball;
    let p1 = this.state.paddleRight;
    let p2 = this.state.paddleLeft;

    // Move ball
    b.x += this.ballSpeed.x;
    b.z += this.ballSpeed.z;

    // Walls X
    if (b.x > TERRAIN_LIMIT_X || b.x < -TERRAIN_LIMIT_X) {
      this.ballSpeed.x *= -1;
    }

    // Paddle R
    if (b.z > p1.z - 0.5 && Math.abs(b.x - p1.x) < 1.5) {
      this.ballSpeed.z *= -1;
    }

    // Paddle L
    if (b.z < p2.z + 0.5 && Math.abs(b.x - p2.x) < 1.5) {
      this.ballSpeed.z *= -1;
    }

    // Score
    if (b.z > TERRAIN_LIMIT_Z) {
      p2.point++;
      this.broadcast(createStateMessage(0, b, p1, p2, p1.point, p2.point, "Score"));
      this.resetBall();
    }

    if (b.z < -TERRAIN_LIMIT_Z) {
      p1.point++;
      this.broadcast(createStateMessage(0, b, p1, p2, p1.point, p2.point, "Score"));
      this.resetBall();
    }

    // ALWAYS send update in old format
    this.broadcast(
      createStateMessage(0, b, p1, p2, p1.point, p2.point, "Update")
    );
  }

  broadcast(msg) {
    const str = JSON.stringify(msg);
    this.players.forEach(p => {
      if (p.readyState === WebSocket.OPEN) p.send(str);
    });
  }
}

/*
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
    if (info.type === "playerMove" && info.key === 'a')
      paddle.position.x += 0.5;
    else if (info.type === "playerMove" && info.key === 'd') {
      paddle.position.x -= 0.5;
      paddle.point = count;
      count++;
    }
    else if (info.type === "Not ready")
      this.setCamera(this.players)
    this.state.ball.position.z += 0.1;
    console.log(this.state, paddle);
  }
  
  update() {
    this.broadcast({ type: 'update', state: this.state });
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

*/