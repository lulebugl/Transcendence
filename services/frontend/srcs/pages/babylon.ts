import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";
const	padelRight = 0;
const	padelLeft = 3;
const	table = 0;
const	ball = 2;

export const Game: Page = () => {
	//mi collego al client 
	let backendMessage;
	const wsUri = "/ws";
	//const ws = new WebSocket("wss://example.com/ws/");
	const websocket = new WebSocket(wsUri);
	(async () => {
		// mi collego
		console.log("Provo a collegarmi");
		websocket.addEventListener("open", () => {
	//		log("CONNECTED");
			console.log("ci siamo")
		});
		websocket.addEventListener("error", (event) => {
			 console.log("WebSocket error: ", event);
		});

		await new Promise((resolve) => {
		websocket.addEventListener("open", resolve, { once: true });
		});
		// ascolto  e parser il json
		websocket.addEventListener("message", (e) => {
			backendMessage = JSON.parse(e.data);
			console.log(backendMessage);
		});

	})();
	let padelPlayer = -1;
	if (backendMessage && backendMessage.player === "player1")
		padelPlayer = padelLeft; //player1 ha sempre il padel left 3
	else
		padelPlayer = padelRight;
    const canvas = document.createElement("canvas");
    canvas.id = "renderCanvas";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.display = "block";
    document.body.appendChild(canvas);
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
	//light.diffuse = new Color3(1,233,18);
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
	const light = new HemisphericLight("light", camera.position);
    //camera.attachControl(canvas, true);
    let meshes: any[] = [];
    (async () => {
		if (!backendMessage)
			return;
        const result = await SceneLoader.ImportMeshAsync(null, "/srcs/pages/pubblic/AssetGlb/", "pong.glb", scene);
        meshes = result.meshes;
        console.log("Mesh caricati:", meshes.map(m => m.name));
		// aggiorno tutte le possizioni dei oggetti
		//meshes[ball].position = new Vector(backendMessage.ball.position.z, backendMessage.ball.position.y, backendMessage.ball.position.x );
		const offset = new Vector3(0, 3, -8); // sopra e indietroS offset per la camera
		camera.setPosition(meshes[padelPlayer].position.add(offset));
		camera.target = meshes[ball].position;
		//await engine.initAsync()
    })();
	window.addEventListener("keydown", (event) =>{
		if (!meshes[0] || websocket.readyState !== Webwebsocket.OPEN)
			return ;
        if (event.key === "a"){
			const clientMessage = 
			{
				key: event.key,
				position: meshes[padelPlayer].position,
			}
		}
		else if (event.key === "b"){
			const clientMessage = 
			{
				key: event.key,
				position: meshes[padelPlayer].position,
			}
		}
		websocket.send(JSON.stringify(clientMessage));
	});
    engine.runRenderLoop(() => {
		if (backendMessage){
		// aggiorno tutte le possizioni dei oggetti
		meshes[ball].position.x = backendMessage.ball.position.x; 
		meshes[ball].position.y = backendMessage.ball.position.y;
		meshes[ball].position.z = backendMessage.ball.position.z;

		meshes[padelRight].position.x = backendMessage.player1.position.x; 
		meshes[padelRight].position.y = backendMessage.player1.position.y;
		meshes[padelRight].position.z = backendMessage.player1.position.z;

		meshes[padelLeft].position.x = backendMessage.player2.position.x; 
		meshes[padelLeft].position.y = backendMessage.player2.position.y;
		meshes[padelLeft].position.z = backendMessage.player2.position.z;

		}
        scene.render();
    });
    window.addEventListener("resize", () => engine.resize());
    return {
        el: canvas,
        cleanup: () => {
		engine.dispose();
		if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.close();
		}
    }
}
}
