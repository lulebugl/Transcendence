import WebSocket from 'ws';
import https from 'https';
import http from 'http';
import fs from "fs";
import { Game } from './gameClass.js';
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
  TERRAIN_LIMIT_Z
} from './ConstVarGameLogic';





export function startWebSocketServer(port = 9000) {
	let gameBreak = false;
	console.log(`Inizialliazazione webSocket wss -NON CONNESSO-`)
	
	function setupHeartbeat(ws) {
		ws.isAlive = true;
		ws.on('pong', () => {
			console.log("pong ricevuto");
			ws.isAlive = true; });
	}
	const server = http.createServer({
	});
	const wss = new WebSocket.Server({ server });
	server.listen(port, () => {
	  console.log(`WSS server in ascolto su wss`);
	});
	const heartbeatInterval = setInterval(() => {
		wss.clients.forEach((ws) => {
			if (ws.isAlive === false){
				gameBreak = true;
				return ws.terminate();
				console.log("consessione persa")
			}
			ws.isAlive = false;
			ws.ping();
		});
	}, 3000);
	const speed = 0.5;
	wss.on('close', () => {
		clearInterval(heartbeatInterval);
		console.log("close WebSocket");
	});
	let pendingPlayer = null;

	
	wss.on('connection', (ws) => {
	setupHeartbeat(ws);
    console.log('Nuovo client connesso!');
	if (pendingPlayer === null){
		pendingPlayer = ws;
		ws.send(JSON.stringify({ type: "start", player: 1 }));
	}
	else {
		pendingPlayer.send(JSON.stringify({ type: "start", player: 1 }));
		ws.send(JSON.stringify({ type: "start", player: 2 }));
		//TODO: add random ID
		const game = new Game(0, pendingPlayer, ws);
		pendingPlayer = null;
	}
//    ws.on('message', (event) => {
//        console.log('Messaggio ricevuto dal client:', event.toString());
//	});
    ws.on('close', () => {
        console.log('Client disconnesso');
		//pendingPlayer = null;
    });
});
}
