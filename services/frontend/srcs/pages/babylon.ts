import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";
const	padelRight = 0;
const	padelLeft = 3;
const	table = 0;
const	ball = 2;

export const Game: Page = () => {
	//mi collego al client 
	let message;
//	() => {
//		const wsUri = "ws://127.0.0.1/";
//		const websocket = new WebSocket(wsUri);	
//		// mi collego
//		websocket.addEventListener("open", () => {
//			log("CONNECTED");
//		});
//		// ascolto  e parser il json
//		websocket.addEventListener("message", (e) => {
//			message = JSON.parse(e.data);
//		});
//
//	}();
	
    const canvas = document.createElement("canvas");
    canvas.id = "renderCanvas";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.display = "block";
    document.body.appendChild(canvas);

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
	const light = new HemisphericLight("light", camera.position);
	//light.diffuse = new Color3(1,233,18);

    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
    //camera.attachControl(canvas, true);


    let meshes: any[] = [];

    (async () => {
        const result = await SceneLoader.ImportMeshAsync(null, "/srcs/pages/pubblic/AssetGlb/", "pong.glb", scene);
        meshes = result.meshes;
        console.log("Mesh caricati:", meshes.map(m => m.name));
		const offset = new Vector3(0, 3, -8); // sopra e indietroS
		camera.setPosition(meshes[3].position.add(offset));
		camera.target = meshes[ball].position;
		//await engine.initAsync()
    })();

    window.addEventListener("keydown", (event) => {
        if (!meshes[0])
			return; // assicurati che il mesh sia caricato
        const speed = 0.1;
        if (event.key === "a")
			if (meshes[3].position.x > -3)
				meshes[3].position.x -= speed;

        if (event.key === "d")
			if (meshes[3].position.x < 3)
			meshes[3].position.x += speed;
		console.log("Posizione iniziale:",meshes[3].position.x);
    });
//	camera.setPosition(meshes[3].position);
	//camera.target = meshes[3].position;

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => engine.resize());

    return {
        el: canvas,
        cleanup: () => engine.dispose()
    };
};

