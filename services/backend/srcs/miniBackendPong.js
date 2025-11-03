import WebSocket from 'ws';
import https from 'https';
import http from 'http';
import fs from "fs";

export function startWebSocketServer(port = 9000) {
	let gameBreak = false;
	console.log(`Inizialliazazione webSocket wss -NON CONNESSO-`)
	function setupGameState(ws)
	{
		ws.send(JSON.stringify({
		    message: "tua madre",
			player: "player1",
			ball: {
			position: {
				x: 0,
				y: 0,
				z: 0
			}
			}
		}));

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

	const gameState = setInterval(() =>
	{
		if (!gameBreak)
			return ;
	}, 16);
	wss.on('close', () => {
		clearInterval(heartbeatInterval);
		console.log("close WebSocket");
	});
	
	wss.on('connection', (ws) => {
	setupHeartbeat(ws);
	setupGameState(ws);
    console.log('Nuovo client connesso!');
    ws.on('message', (msg) => {
        console.log('Messaggio ricevuto dal client:', msg.toString());
    });
    ws.on('close', () => {
        console.log('Client disconnesso');
    });
});
}

