import { CustomWebSocket } from './miniBackendPong';
import WebSocket from 'ws';

import {
  START_BALL_X,
  START_BALL_Y,
  START_BALL_Z,
  START_PADDLE_RIGHT_X,
  START_PADDLE_RIGHT_Y,
  START_PADDLE_RIGHT_Z,
  START_PADDLE_LEFT_X,
  START_PADDLE_LEFT_Y,
  START_PADDLE_LEFT_Z,
  TERRAIN_LIMIT_X_MIN,
  TERRAIN_LIMIT_X_MAX,
  TERRAIN_LIMIT_Y_MIN,
  TERRAIN_LIMIT_Y_MAX,
  TERRAIN_LIMIT_Z_MIN,
  TERRAIN_LIMIT_Z_MAX,
  PADDLE_WIDTH,
  BALL_START_SPEED,
  BALL_RADIUS,
  BALL_MAX_SPEED,
  PADDLE_START_STEP,
  PADDLE_MIN_STEP,
  PADDLE_MAX_STEP,
  LIMIT_POINT,
  TIMER_PAUSE,
  BALL_MIN_SPEED,
  GAME_START_COUNTDOWN
} from './ConstVarGameLogic';

interface GameState {
  message: string;
  GamesID: string;
  break: boolean;
  ball: {
    position: { x: number; y: number; z: number };
    angle: number;
    speed: number;
  };
  paddleRight: {
    position: { x: number; y: number; z: number };
    point: number;
  };
  paddleLeft: {
    position: { x: number; y: number; z: number };
    point: number;
  };
}

function InfoInGame(
  id = "",
  ballx = START_BALL_X, bally = START_BALL_Y, ballz = START_BALL_Z,
  p1x = START_PADDLE_RIGHT_X, p1y = START_PADDLE_RIGHT_Y, p1z = START_PADDLE_RIGHT_Z,
  p2x = START_PADDLE_LEFT_X, p2y = START_PADDLE_LEFT_Y, p2z = START_PADDLE_LEFT_Z,
  point2 = 0, point1 = 0,
  messageType = "Update",
  ballAngle = 3 * Math.PI / 2,  // Initial angle
  gamesPause = false
): GameState {
  const message: GameState = {
    message: messageType,
    GamesID: id,
    break: gamesPause,
    ball: {
      position: { x: ballx, y: bally, z: ballz },
      angle: ballAngle,
      speed: BALL_START_SPEED
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
  private players: CustomWebSocket[];
  private state: GameState;
  private loop: any;
  private ballFrozen: boolean = false;
  private sceneIsReadyLeft: boolean = false;
  private sceneIsReadyRight: boolean = false;
  private breakTimeStart: number = 0;
  private timeGame: number = 0;

  // Pause logic properties
  private PauseFlag: boolean = false;
  private speedMemory: number = 0;

  // 🔹 value of sensitivity, to take from setting's player, here is jsut to test
  private paddleSensitivityPlayer1: number = 0.9;
  private paddleSensitivityPlayer2: number = 0.9;

  constructor(MatchId: string, player1: CustomWebSocket, player2: CustomWebSocket) {
    this.id = MatchId;
    this.players = [player1, player2];
    this.state = InfoInGame(MatchId);
    this.sceneIsReadyLeft = false;
    this.sceneIsReadyRight = false;
    // ascolta i messaggi dei due client
    //TODO: setto la camera per i player

    this.players.forEach((ws, i) => {
      ws.on('message', (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          this.updateKey(data, i);
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      });
    });

    this.startTimer();
  }

  startTimer() {
    let countdown = GAME_START_COUNTDOWN;

    const interval = setInterval(() => {
      if (this.sceneIsReadyLeft && this.sceneIsReadyRight) {
        countdown--;

        if (countdown < 0) {
          clearInterval(interval);
          this.timeGame = Date.now();
          this.loop = setInterval(() => this.update(), 44);
        } else {

          this.broadcast({ type: 'timer', count: countdown });
        }
      }
      else {
        this.broadcast({ type: 'ready?' });
      }
    }, 1000);
  }

  updateKey(msg, playerIndex) {
    process.env.NODE_ENV === 'development' && console.log(msg);
    const info = msg;

    // Which paddle
    let paddle = playerIndex === 0
      ? this.state.paddleRight
      : this.state.paddleLeft;

    // Key set up
    const LEFT_KEY = 'a';
    const RIGHT_KEY = 'd';

    // apply sensitivity
    const sensitivity = this.clampSensitivity(
      playerIndex === 0
        ? this.paddleSensitivityPlayer1
        : this.paddleSensitivityPlayer2
    );

    const step = PADDLE_START_STEP * sensitivity; // base step(can be modify if we want) * sensitivity

    if (info.type === "playerMove") {
      // Player 1 : normal
      if (playerIndex === 0) {
        if (info.key === LEFT_KEY) {
          paddle.position.x = Math.max(TERRAIN_LIMIT_X_MIN, paddle.position.x - step);
        } else if (info.key === RIGHT_KEY) {
          paddle.position.x = Math.min(TERRAIN_LIMIT_X_MAX, paddle.position.x + step);
        }
      }
      // Player 2 : switch
      else {
        if (info.key === LEFT_KEY) {
          paddle.position.x = Math.min(TERRAIN_LIMIT_X_MAX, paddle.position.x + step);
        } else if (info.key === RIGHT_KEY) {
          paddle.position.x = Math.max(TERRAIN_LIMIT_X_MIN, paddle.position.x - step);
        }
      }
    } else if (info.type === "ready") {
      if (playerIndex === 0) {
        this.sceneIsReadyRight = true;
        this.sendToClient({ type: "start", player: playerIndex + 1 }, playerIndex);
      }
      else {
        this.sceneIsReadyLeft = true;
        this.sendToClient({ type: "start", player: playerIndex + 1 }, playerIndex);
      }
    }

    if (info.type === "Not ready")
      this.setCamera();
    process.env.NODE_ENV === 'development' && console.log(this.state, paddle);
  }

  update() {
    // Ball movement
    if (!this.ballFrozen && !this.PauseFlag) {
      this.state.ball.position.x += Math.cos(this.state.ball.angle) * this.state.ball.speed;
      this.state.ball.position.z += Math.sin(this.state.ball.angle) * this.state.ball.speed;
    }

    // Wall collision (X axis)
    if (this.state.ball.position.x - BALL_RADIUS <= TERRAIN_LIMIT_X_MIN || this.state.ball.position.x + BALL_RADIUS >= TERRAIN_LIMIT_X_MAX) {
      this.state.ball.angle = Math.PI - this.state.ball.angle;
    }

    // Paddle collision (Z axis)
    // Paddle Right (Positive Z)
    if (this.state.ball.position.z + BALL_RADIUS >= this.state.paddleRight.position.z && // Check depth
      this.state.ball.position.x >= this.state.paddleRight.position.x - PADDLE_WIDTH / 2 &&
      this.state.ball.position.x <= this.state.paddleRight.position.x + PADDLE_WIDTH / 2) {

      this.reflectBall(this.state.paddleRight, true);
      process.env.NODE_ENV === 'development' && console.log(this.state, this.state.paddleRight);
    }

    // Paddle Left (Negative Z)
    if (this.state.ball.position.z - BALL_RADIUS <= this.state.paddleLeft.position.z && // Check depth
      this.state.ball.position.x >= this.state.paddleLeft.position.x - PADDLE_WIDTH / 2 &&
      this.state.ball.position.x <= this.state.paddleLeft.position.x + PADDLE_WIDTH / 2) {

      this.reflectBall(this.state.paddleLeft, false);
      process.env.NODE_ENV === 'development' && console.log(this.state, this.state.paddleLeft);
    }

    // Scoring
    if (this.state.ball.position.z > TERRAIN_LIMIT_Z_MAX) {
      this.state.paddleLeft.point++;
      this.freezeBallAndReset();
    } else if (this.state.ball.position.z < TERRAIN_LIMIT_Z_MIN) {
      this.state.paddleRight.point++;
      this.freezeBallAndReset();
    }

    // Pause Logithi
    if (this.state.paddleLeft.point === LIMIT_POINT || this.state.paddleRight.point === LIMIT_POINT) {
      return this.broadcast({ type: 'gameOver', winner: this.getWinnerIndexObjMesh() });
    }
    if (this.PauseFlag) {
      this.state.break = true;
      let breakTime = Date.now() - this.breakTimeStart;
      if (this.state.ball.speed !== 0) {
        this.speedMemory = this.state.ball.speed;
        this.state.ball.speed = 0;
      }
      // verifico da quanto tempo é disconesso se è piu di TIMER_PAUSE disconetto tutti
      if (this.state.break && breakTime > TIMER_PAUSE) {
        this.broadcast({ type: 'gameOver', winner: this.getWinnerIndexObjMesh() });
        this.state.break = false;
        this.stop();
      }

      if (this.areAllPlayersConnected()) {
        this.PauseFlag = false;
        this.state.break = false;
        // Resume speed
        if (this.speedMemory !== 0) {
          this.state.ball.speed = this.speedMemory;
          this.speedMemory = 0;
        } else {
          // Fallback if speedMemory was 0
          this.state.ball.speed = BALL_START_SPEED;
        }
        this.setCamera();
      }
    }

    this.broadcast({ type: 'update', state: this.state });
  }

  private freezeBallAndReset() {
    // Freeze ball
    this.ballFrozen = true;
    this.state.ball.speed = 0;

    // Place ball in center
    this.state.ball.position.x = START_BALL_X;
    this.state.ball.position.z = START_BALL_Z;

    // Wait 1 sencond then unfreeze ball so it restart moving
    setTimeout(() => {
      this.resetBall();
      this.ballFrozen = false;
    }, 1000);
  }

  resetBall() {
    this.state.ball.position.x = START_BALL_X;
    this.state.ball.position.z = START_BALL_Z;
    this.state.ball.speed = BALL_START_SPEED;
    this.state.ball.angle = (Math.random() < 0.5 ? Math.PI / 2 : 3 * Math.PI / 2) + (Math.random() - 0.5) * Math.PI / 2;
  }

  broadcast(data) {
    const msg = JSON.stringify(data);
    this.players.forEach(p => {
      if (p.readyState === WebSocket.OPEN)
        p.send(msg);
    });
  }
  setCamera() {
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
  // reflect form paddles
  private reflectBall(paddle, isRightPaddle: boolean) {

    let relativeX = (this.state.ball.position.x - paddle.position.x) / (PADDLE_WIDTH / 2);
    relativeX = Math.max(-1, Math.min(1, relativeX));

    const maxBounceAngle = Math.PI / 3; // 60°

    let baseAngle: number;

    if (isRightPaddle) {
      baseAngle = 3 * Math.PI / 2;
      this.state.ball.angle = baseAngle + relativeX * maxBounceAngle;
    } else {
      baseAngle = Math.PI / 2;
      this.state.ball.angle = baseAngle - relativeX * maxBounceAngle;
    }

    this.state.ball.speed = this.clampBallSpeed(this.state.ball.speed * 1.2);

  }

  // To set up sensitivity between 0 and 1
  private clampSensitivity(value: number): number {
    return Math.max(PADDLE_MIN_STEP, Math.min(PADDLE_MAX_STEP, value));
  }

  // To cap ball speed between 0 and 1
  private clampBallSpeed(value: number): number {
    return Math.max(BALL_MIN_SPEED, Math.min(BALL_MAX_SPEED, value));
  }

  // Preserved Pause Methods
  private areAllPlayersConnected(): boolean {
    return this.players.every(p => p && p.readyState === WebSocket.OPEN);
  }

  public setPauseFlags(flag: boolean) {
    this.PauseFlag = flag;
    this.state.break = flag;
    this.broadcast({ type: 'update', state: this.state });
    this.breakTimeStart = Date.now();
  }

  updatePlayerSocket(playerIndex: number, newSocket: CustomWebSocket) {
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

  public sendToClient(message: any, playerIndex: number) {
    if (this.players[playerIndex]) {
      this.players[playerIndex].send(JSON.stringify(message));
    }
  }
  public disconnectPlayer() {
    this.broadcast({ type: 'gameOver', winner: 0 });
  }
  // paddleLeft = player 1, paddleRight = player 2
  public getScorePlayer(playerIndex: number): number {
    if (playerIndex === 2) {
      return this.state.paddleLeft.point;
    } else if (playerIndex === 1) {
      return this.state.paddleRight.point;
    }
    return -1;
  }
  public getTimeMatch(): number {
    return this.timeGame;
  }
  public stopTimeMatch() {
    this.timeGame = Date.now() - this.timeGame;
  }

  public getWinnerGamer(): number {
    if (this.state.paddleLeft.point > this.state.paddleRight.point) {
      return Number(this.players[1].user?.id);
    } else if (this.state.paddleLeft.point < this.state.paddleRight.point) {
      return Number(this.players[0].user?.id);
    }
    return -1;
  }
  public getWinnerIndexObjMesh(): number {
    if (this.state.paddleLeft.point > this.state.paddleRight.point) {
      return 11;
    } else if (this.state.paddleLeft.point < this.state.paddleRight.point) {
      return 8;
    }
    return 0;
  }

}
