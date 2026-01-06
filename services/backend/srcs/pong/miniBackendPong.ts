import WS from "ws";
import { FastifyInstance } from "fastify";
import http from "http";
import { Game } from "./gameClass";
import { playerMatches } from "../routes/matchMaking";
import { processGameCompletion } from "./gameCompletion";

export type CustomWebSocket = WS & {
  isAlive: boolean;
  playerSlot?: number;
  matchId?: string;
  playerId?: string;
};

export function startWebSocketServer(app: FastifyInstance, port = 9000) {
  let gameBreak = false;
  console.log(`Inizialliazazione webSocket wss -NON CONNESSO-`);

  // Map to store active game sessions: matchId -> { player1, player2, game }
  const games = new Map<
    string,
    {
      player1: CustomWebSocket | null;
      player2: CustomWebSocket | null;
      game: Game | null;
      p1Id: string | null;
      p2Id: string | null;
    }
  >();

  function setupHeartbeat(ws: CustomWebSocket) {
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
      //  console.log("pong");
    });
  }
  const server = http.createServer({});
  const wss = new WS.Server({ noServer: true });
  console.log(`WSS server inizializzato`);
  server.listen(port, () => {
    console.log(`WSS server in ascolto su wss`);
  });
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const customWs = ws as CustomWebSocket;
      if (customWs.isAlive === false) {
        gameBreak = true;
        console.log("consessione persa");
        return customWs.terminate();
      }
      //  console.log("ping");
      customWs.isAlive = false;
      customWs.ping();
    });
  }, 3000);

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
    console.log("close WebSocket");
  });
  server.on("upgrade", async (req, socket, head) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const matchId = url.searchParams.get("matchId");
    const token = url.searchParams.get("wsToken"); // Changed from wsToken to token to match plan/convention

    if (!matchId || !token) {
      if (!token) {
        console.log("No token;");
      } else if (!matchId) {
        console.log("No matchId");
      }
      console.log("closing upgrade");
      socket.destroy();
      return;
    }

    try {
      const decoded = app.jwt.verify<{ playerId: number; username: string }>(
        token
      );
      (req as any).user = decoded;
      (req as any).matchId = matchId;
    } catch (err) {
      console.log("Invalid token, closing connection", err);
      if (!socket.destroyed) {
        socket.destroy();
      }
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      (ws as any).user = (req as any).user;
      (ws as any).matchId = (req as any).matchId;
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", async (ws: CustomWebSocket, req) => {
    console.log("Nuovo client connesso!");

    const matchId = (req as any).matchId;
    const user = (req as any).user;

    if (!matchId || !user) {
      if (!matchId) {
        console.log("No matchId");
        console.log(matchId);
      } else if (!user) {
        console.log("No user");
      }
      console.log("closing wss server");
      ws.close();
      return;
    }

    if (user.id && user.username) {
    } else {
      console.log(user);
    }
    const playerId = user.playerId.toString();
    const username = user.username;
    if (!playerId || !username) {
      console.log("No playerId or username");
      ws.close();
      return;
    }

    console.log(`User authenticated: ${username} (${playerId})`);

    let session = games.get(matchId);

    if (!session) {
      const newSession = {
        player1: null,
        player2: null,
        game: null,
        p1Id: null,
        p2Id: null,
      };
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
      ws.send(
        JSON.stringify({ type: "waiting", message: "Waiting for opponent..." })
      );
      console.log(`Player 1 connected to match ${matchId} (ID: ${playerId})`);
      setupHeartbeat(ws);
    } else if (!session.p2Id) {
      session.player2 = ws;
      session.p2Id = playerId;
      ws.playerSlot = 2;
      ws.matchId = matchId;
      ws.playerId = playerId;
      console.log(`Player 2 connected to match ${matchId} (ID: ${playerId})`);
      ws.send(
        JSON.stringify({
          type: "waiting",
          message: "Opponent found, starting match...",
        })
      );
      session.game = new Game(
        matchId.toString(),
        session.player1,
        session.player2
      );
      setupHeartbeat(ws);
    } else {
      console.log(`Match ${matchId} is full. Rejecting ${playerId}`);
      ws.send(JSON.stringify({ type: "error", message: "Match full" }));
      ws.close();
      return;
    }

    ws.on("close", async () => {
      const wsMatchId = ws.matchId;
      const wsPlayerId = ws.playerId;

      console.log(
        `Client disconnected from match ${wsMatchId} (ID: ${wsPlayerId})`
      );

      const wsSession = games.get(wsMatchId);
      if (!wsSession) return;

      if (wsSession.player1 === ws) {
        wsSession.player1 = null;
        if (wsSession.game) wsSession.game.setPauseFlags(true);
      }

      if (wsSession.player2 === ws) {
        wsSession.player2 = null;
        if (wsSession.game) wsSession.game.setPauseFlags(true);
      }

      if (!wsSession.player1 && !wsSession.player2) {
        console.log(`Both players disconnected, removing match ${wsMatchId}`);
        // reconetction logic and stop timeMatch
        if (wsSession.p1Id) playerMatches.delete(wsSession.p1Id);
        if (wsSession.p2Id) playerMatches.delete(wsSession.p2Id);

        if (wsSession.game) {
          wsSession.game.stopTimeMatch();

          if (wsSession.p1Id && wsSession.p2Id) {
            await processGameCompletion({
              player1Id: Number(wsSession.p1Id),
              player2Id: Number(wsSession.p2Id),
              player1Score: wsSession.game.getScorePlayer(1),
              player2Score: wsSession.game.getScorePlayer(2),
              durationSeconds: wsSession.game.getTimeMatch(),
            });
          }

          // stop gameLoop and delete game
          wsSession.game.stop();
          wsSession.game = null;
        }
        games.delete(wsMatchId);
      }
    });
  });
}
