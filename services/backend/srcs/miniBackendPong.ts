import WebSocket from 'ws';
import https from 'https';
import http from 'http';
import fs from "fs";
import { Game } from './gameClass.js';
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
} from './ConstVarGameLogic';

function InfoInJson(
	id = "player1",
	ballx = startBallX, bally = startBallY, ballz = startBallZ,
	p1x = startPaddleRightX, p1y = startPaddleRightY, p1z = startPaddleRightZ,
	p2x = startPaddleLeftX, p2y = startPaddleLeftY, p2z = startPaddleLeftZ,
	messageType = "Game Update"
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

	// Map to store active game sessions: matchId -> { player1, player2, game }
	const games = new Map<string, { player1: WebSocket | null, player2: WebSocket | null, game: Game | null }>();

	function setupHeartbeat(ws) {
		ws.isAlive = true;
		ws.on('pong', () => {
			// console.log("pong ricevuto");
			ws.isAlive = true;
		});
	}
	const server = http.createServer({
	});
	const wss = new WebSocket.Server({ server });
	server.listen(port, () => {
		console.log(`WSS server in ascolto su wss`);
	});
	const heartbeatInterval = setInterval(() => {
		wss.clients.forEach((ws) => {
			if (ws.isAlive === false) {
				gameBreak = true;
				console.log("consessione persa")
				return ws.terminate();
			}
			ws.isAlive = false;
			ws.ping();
		});
	}, 3000);

	wss.on('close', () => {
		clearInterval(heartbeatInterval);
		console.log("close WebSocket");
	});

	wss.on('connection', (ws, req) => {
		setupHeartbeat(ws);
		console.log('Nuovo client connesso!');

		// Extract matchId from URL
		const url = new URL(req.url, `http://${req.headers.host}`);
		const matchId = url.searchParams.get('matchId');

		if (!matchId) {
			console.log("No matchId provided, closing connection");
			ws.close();
			return;
		}

		let session = games.get(matchId);
		if (!session) {
			session = { player1: null, player2: null, game: null };
			games.set(matchId, session);
		}

		if (!session.player1) {
			session.player1 = ws;
			ws.send(JSON.stringify({ type: "waiting", message: "Waiting for opponent..." }));
			console.log(`Player 1 connected to match ${matchId}`);
		} else if (!session.player2) {
			session.player2 = ws;
			console.log(`Player 2 connected to match ${matchId}`);

			// Notify players
			session.player1.send(JSON.stringify({ type: "start", player: 1 }));
			session.player2.send(JSON.stringify({ type: "start", player: 2 }));

			// Start Game
			session.game = new Game(matchId, session.player1, session.player2);
		} else {
			console.log(`Match ${matchId} is full`);
			ws.send(JSON.stringify({ type: "error", message: "Match full" }));
			ws.close();
		}

		ws.on('close', () => {
			console.log(`Client disconnected from match ${matchId}`);
			// Handle disconnection logic - maybe end game?
			if (session) {
				if (session.game) {
					session.game.stop();
				}
				games.delete(matchId);
			}
		});
	});
}
