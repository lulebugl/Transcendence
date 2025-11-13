import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader, Matrix } from "@babylonjs/core";
import { Vector3, Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
const	padelRight = 4;
const	padelLeft = 3;
const	table = 1;
const	ball = 2;

export const Game: Page = () => {
	//mi collego al client 
	let backendMessage;
	const wsUri = "/ws";
	let padelPlayer = -1;
	const offsetLeft = new Vector3(0, 8, -10); //player2
	const offsetRight = new Vector3(0, 8, 10); //player1
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
	function sendMessage(message) {
        if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify(message));
            console.log("Messaggio inviato:", message);
        }
		else {
            console.log("WebSocket non aperto, impossibile inviare messaggio");
        }
    }

    const canvas = document.createElement("canvas");
    canvas.id = "renderCanvas";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.display = "block";
    document.body.appendChild(canvas);
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
	//light.diffuse = new Color3(1,233,18);
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 20, 10), scene);
	const light = new HemisphericLight("light", camera.position);
    //camera.attachControl(canvas, true);
    let meshes: any[] = [];
    (async () => {
        const result = await SceneLoader.ImportMeshAsync(null, "/srcs/pages/pubblic/AssetGlb/", "pong.glb", scene);
        meshes = result.meshes;
        console.log("Mesh caricati:", meshes.map(m => m.name));

    })();
	window.addEventListener("keydown", (event) =>{
		if (!meshes[0] || websocket.readyState !== websocket.OPEN)
			return ;
        if (event.key === "a" || event.key === "d"){
			const clientMessage = {
            type: "playerMove",
            key: event.key,
            position: meshes[padelPlayer].getAbsolutePosition()
			};
			websocket.send(JSON.stringify(clientMessage));
		}
	});
    engine.runRenderLoop(() => {
		if (!meshes[0]){
			return ;
		}
		if (backendMessage && backendMessage.type === 'update'){
		// aggiorno tutte le possizioni dei oggetti
		meshes[ball].position.y = backendMessage.state.ball.position.x;
		meshes[ball].position.x = backendMessage.state.ball.position.y;
		meshes[ball].position.z = backendMessage.state.ball.position.z;

		meshes[padelRight].position.x = backendMessage.state.padelRight.position.x; 
		meshes[padelRight].position.y = backendMessage.state.padelRight.position.y;
		meshes[padelRight].position.z = backendMessage.state.padelRight.position.z;

		meshes[padelLeft].position.x = backendMessage.state.padelLeft.position.x; 
		meshes[padelLeft].position.y = backendMessage.state.padelLeft.position.y;
		meshes[padelLeft].position.z = backendMessage.state.padelLeft.position.z;
		}
		else if (backendMessage && backendMessage.type === "start"){
			let offset;
			if (backendMessage.player === 1){
				padelPlayer = padelRight;
				offset = offsetRight;
				console.log("player1")
			}
			else if (backendMessage.player === 2){
				padelPlayer = padelLeft;
				offset = offsetLeft;
				console.log("player2")
			}
		if (padelPlayer === -1 ){
			sendMessage({ type: "Not ready", text: "Player non init" });
			return ;
		}
		camera.setPosition(meshes[padelPlayer].position.add(offset));
		camera.target = meshes[ball].position;
		console.log(camera.position);
		}
		else
		{
			return ;
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
