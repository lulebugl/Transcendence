import WebSocket from 'ws';
import https from 'https';
import fs from "fs";

export function startWebSocketServer(port = 9000) {
	console.log(`Inizialliazazione webSocket wss -NON CONNESSO-`)
	//const path = require("path");
	//const file = fs.readFileSync(path.resolve(__dirname, "../file.xml"));
	const server = https.createServer({
		key: fs.readFileSync("/etc/cert/selfsigned.key"),
		cert: fs.readFileSync("/etc/cert/selfsigned.crt")
	});
	const wss = new WebSocket.Server({ server });
	server.listen(port, () => {
	  console.log(`WSS server in ascolto su wss`);
	});

	wss.on('connection', (ws) => {
    console.log('Nuovo client connesso!');

    ws.send(JSON.stringify({ message: 'Benvenuto al Pong WebSocket!' }));

    ws.on('message', (msg) => {
        console.log('Messaggio ricevuto dal client:', msg.toString());
    });

    ws.on('close', () => {
        console.log('Client disconnesso');
    });
});
}

