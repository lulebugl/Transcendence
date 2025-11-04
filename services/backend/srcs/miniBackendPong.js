import WebSocket from 'ws';
import https from 'https';
import http from 'http';
import fs from "fs";
import { Game } from './gameClass.js';
const	startBallX = 0.6;
const	startBallY = 0; 
const	startBallZ = 0;
const	startPadelRightX = 0;
const	startPadelRightY = 0.6;
const	startPadelRightZ = 7;
const	startPadelLeftX = 0;
const	startPadelLeftY = 0.6;
const	startPadelLeftZ = -7;
function InfoInJson(
    id = "player1",
    ballx = startBallX, bally = startBallY, ballz = startBallZ,
    p1x = startPadelRightX, p1y = startPadelRightY, p1z = startPadelRightZ,
    p2x = startPadelLeftX, p2y = startPadelLeftY, p2z = startPadelLeftZ,
    messageType = "tua madre"
) {
    const message = {
        message: messageType,
        player: id,
        ball: {
            position: { x: ballx, y: bally, z: ballz }
        },
        player1: {
            position: { x: p1x, y: p1y, z: p1z }
        },
        player2: {
            position: { x: p2x, y: p2y, z: p2z }
        }
    };

    return JSON.stringify(message);
}



export function startWebSocketServer(port = 9000) {
	let gameBreak = false;
	console.log(`Inizialliazazione webSocket wss -NON CONNESSO-`)
	function setupGameState(ws){
		ws.send(InfoInJson());
	}
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
