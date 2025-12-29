import WS from 'ws'; import { FastifyInstance } from 'fastify';
import http from 'http';



type CustomWebSocket = WS & {
	isAlive: boolean;
	playerSlot?: number;
	matchId?: string;
	playerId?: string;
};

export function startWebSocketServer(app: FastifyInstance, port = 9000) {
	let gameBreak = false;
	console.log(`Inizialliazazione webSocket wss -NON CONNESSO-`)

	// Map to store active game sessions: matchId -> { player1, player2, game }
	const games = new Map<string, { player1: CustomWebSocket | null, player2: CustomWebSocket | null, game: Game | null, p1Id: string | null, p2Id: string | null }>();

	function setupHeartbeat(ws: CustomWebSocket) {
		ws.isAlive = true;
		ws.on('pong', () => {
			ws.isAlive = true;
		});
	}
	const server = http.createServer({
	});
	const wss = new WS.Server({ server });
	server.listen(port, () => {
		console.log(`WSS server in ascolto su wss`);
	});
	const heartbeatInterval = setInterval(() => {
		wss.clients.forEach((ws) => {
			const customWs = ws as CustomWebSocket;
			if (customWs.isAlive === false) {
				gameBreak = true;
				console.log("consessione persa")
				return customWs.terminate();
			}
			customWs.isAlive = false;
			customWs.ping();
		});
	}, 3000);

	wss.on('close', () => {
		clearInterval(heartbeatInterval);
		console.log("close WebSocket");
	});
	server.on('upgrade', async (req, socket, head) => {
		const url = new URL(req.url!, `http://${req.headers.host}`);
		const matchId = url.searchParams.get('matchId');
		const token = url.searchParams.get('wsToken'); // Changed from wsToken to token to match plan/convention

		if (!matchId || !token) {
			console.log("No matchId or token provided, closing connection");
			socket.destroy();
			return;
		}

		try {
			const decoded = app.jwt.verify<{ id: number, username: string }>(token);
			(req as any).user = decoded;
			(req as any).matchId = matchId;
		} catch (err) {
			console.log("Invalid token, closing connection", err);
			socket.destroy();
			return;
		}

		wss.handleUpgrade(req, socket, head, (ws) => {
			wss.emit('connection', ws, req);
		});
	});

	wss.on('connection', async (ws: CustomWebSocket, req) => {
		console.log('Nuovo client connesso!');


		const matchId = (req as any).matchId;
		const user = (req as any).user;

		if (!matchId || !user) {
			console.log("Missing matchId or user info in connection");
			ws.close();
			return;
		}

		const playerId = user.id.toString();
		const username = user.username;

		console.log(`User authenticated: ${username} (${playerId})`);

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
			ws.playerSlot = 1;
			ws.matchId = matchId;
			ws.playerId = playerId;
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
			ws.playerSlot = 2;
			ws.matchId = matchId;
			ws.playerId = playerId;
			setupHeartbeat(ws);
			if (session.game) {
				session.game.updatePlayerSocket(1, ws);
			}
		} else if (!session.p1Id) {
			session.player1 = ws;
			session.p1Id = playerId;
			ws.playerSlot = 1;
			ws.matchId = matchId;
			ws.playerId = playerId;
			ws.send(JSON.stringify({ type: "waiting", message: "Waiting for opponent..." }));
			console.log(`Player 1 connected to match ${matchId} (ID: ${playerId})`);
			setupHeartbeat(ws);
		} else if (!session.p2Id) {
			session.player2 = ws;
			session.p2Id = playerId;
			ws.playerSlot = 2;
			ws.matchId = matchId;
			ws.playerId = playerId;
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
			const wsMatchId = ws.matchId;
			const wsPlayerId = ws.playerId;

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
