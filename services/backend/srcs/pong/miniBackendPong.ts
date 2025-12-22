import WebSocket from 'ws';
import http from 'http';
import { Game } from './gameClass';

import { db } from '../db/client';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export function startWebSocketServer(port = 9000) {
	let gameBreak = false;
	console.log(`Inizialliazazione webSocket wss -NON CONNESSO-`)

	// Map to store active game sessions: matchId -> { player1, player2, game }
	const games = new Map<string, { player1: WebSocket | null, player2: WebSocket | null, game: Game | null, p1Id: string | null, p2Id: string | null }>();

	function setupHeartbeat(ws) {
		ws.isAlive = true;
		ws.on('pong', () => {
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
			if ((ws as any).isAlive === false) {
				gameBreak = true;
				console.log("consessione persa")
				return ws.terminate();
			}
			(ws as any).isAlive = false;
			ws.ping();
		});
	}, 3000);

	wss.on('close', () => {
		clearInterval(heartbeatInterval);
		console.log("close WebSocket");
	});

	wss.on('connection', async (ws, req) => {
		console.log('Nuovo client connesso!');

		const url = new URL(req.url!, `http://${req.headers.host}`);
		const matchId = url.searchParams.get('matchId');

		if (!matchId) {
			console.log("No matchId provided, closing connection");
			ws.close();
			return;
		}

		// Parse cookies to get refreshToken
		const cookieHeader = req.headers.cookie;
		if (!cookieHeader) {
			console.log("No cookies provided, closing connection");
			ws.close();
			return;
		}

		const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
		const refreshToken = cookies['refreshToken'];

		if (!refreshToken) {
			console.log("No refresh token found, closing connection");
			ws.close();
			return;
		}

		let playerId: string;
		let username: string;

		try {
			const [user] = await db.select().from(users).where(eq(users.refresh_token, refreshToken));

			if (!user) {
				console.log("Invalid refresh token, closing connection");
				ws.close();
				return;
			}

			playerId = user.id.toString();
			username = user.username;
			console.log(`User authenticated via cookie: ${username} (${playerId})`);

		} catch (err) {
			console.error("Database error during auth:", err);
			ws.close();
			return;
		}

		let session = games.get(matchId);

		if (!session) {
			const newSession = { player1: null, player2: null, game: null, p1Id: null, p2Id: null };
			games.set(matchId, newSession);
			session = games.get(matchId);
		}

		// Handle reconnection or new connection
		if (session.p1Id === playerId) {
			console.log(`Player 1 reconnected to match ${matchId}`);
			if (session.player1 && session.player1 !== ws) {
				session.player1.terminate();
			}
			session.player1 = ws;
			(ws as any).playerSlot = 1;
			(ws as any).matchId = matchId;
			(ws as any).playerId = playerId;
			setupHeartbeat(ws);
			if (session.game) {
				session.game.updatePlayerSocket(0, ws);
			}
		} else if (session.p2Id === playerId) {
			console.log(`Player 2 reconnected to match ${matchId}`);
			if (session.player2 && session.player2 !== ws) {
				session.player2.terminate();
			}
			session.player2 = ws;
			(ws as any).playerSlot = 2;
			(ws as any).matchId = matchId;
			(ws as any).playerId = playerId;
			setupHeartbeat(ws);
			if (session.game) {
				session.game.updatePlayerSocket(1, ws);
			}
		} else if (!session.p1Id) {
			session.player1 = ws;
			session.p1Id = playerId;
			(ws as any).playerSlot = 1;
			(ws as any).matchId = matchId;
			(ws as any).playerId = playerId;
			ws.send(JSON.stringify({ type: "waiting", message: "Waiting for opponent..." }));
			console.log(`Player 1 connected to match ${matchId} (ID: ${playerId})`);
			setupHeartbeat(ws);
		} else if (!session.p2Id) {
			session.player2 = ws;
			session.p2Id = playerId;
			(ws as any).playerSlot = 2;
			(ws as any).matchId = matchId;
			(ws as any).playerId = playerId;
			console.log(`Player 2 connected to match ${matchId} (ID: ${playerId})`);
			session.game = new Game(matchId, session.player1, session.player2);
			setupHeartbeat(ws);
		} else {
			console.log(`Match ${matchId} is full. Rejecting ${playerId}`);
			ws.send(JSON.stringify({ type: "error", message: "Match full" }));
			ws.close();
			return;
		}

		ws.on('close', () => {
			const wsMatchId = (ws as any).matchId;
			const wsPlayerId = (ws as any).playerId;

			console.log(`Client disconnected from match ${wsMatchId} (ID: ${wsPlayerId})`);

			const wsSession = games.get(wsMatchId);
			if (!wsSession) return;

			if (wsSession.player1 === ws) {
				wsSession.player1 = null;
				wsSession.game.setPauseFlags(true);
			}

			if (wsSession.player2 === ws) {
				wsSession.player2 = null;
				wsSession.game.setPauseFlags(true);
			}

			if (!wsSession.player1 && !wsSession.player2) {
				if (wsSession.game) {
					wsSession.game.stop();
					wsSession.game = null;
				}
				console.log(`Both players disconnected, removing match ${wsMatchId}`);
				games.delete(wsMatchId);
			}
		});

	});
}
