
import WebSocket from 'ws';
import {
  startBallX,
  startBallY,
  startBallZ,
  startPadelRightX,
  startPadelRightY,
  startPadelRightZ,
  startPadelLeftX,
  startPadelLeftY,
  startPadelLeftZ,
  TERRAIN_LIMIT_X,
  TERRAIN_LIMIT_Y
} from './ConstVarGameLogic';

 function InfoInGame(
    id = 0,
    ballx = startBallX, bally = startBallY, ballz = startBallZ,
    p1x = startPadelRightX, p1y = startPadelRightY, p1z = startPadelRightZ,
    p2x = startPadelLeftX, p2y = startPadelLeftY, p2z = startPadelLeftZ,
    messageType = "Update"
) {
    const message = {
        message: messageType,
        GamesID: id,
        ball: {
            position: { x: ballx, y: bally, z: ballz }
        },
        padelRight: {
            position: { x: p1x, y: p1y, z: p1z }
        },
        padelLeft: {
            position: { x: p2x, y: p2y, z: p2z }
        }
    };

    return (message);
}

export class Game {
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

	this.players.forEach((ws, i) => {
		ws.on('message', (msg) => this.updateKey(msg, i));
	});
    this.loop = setInterval(() => this.update(), 16);
  }
  updateKey(msg, playerIndex) {
	  console.log(msg);
        const info = msg;
        let paddle = playerIndex === 0 ? this.state.padelRight : this.state.padelLeft;
	  if (info.type === "playerMove" && info.key === 'a')
		  paddle.position.x += 0.5;
	  else if (info.type === "playerMove" && info.key === 'd')
		  paddle.position.x -= 0.5;
	  else if (info.type === "Not ready")
		  this.setCamera(this.players)
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
	setCamera(players){
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

