import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";

export const Game: Page = () => {
    // 1️⃣ Canvas
    const canvas = document.createElement("canvas");
    canvas.id = "renderCanvas";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.display = "block";
    document.body.appendChild(canvas);

    // 2️⃣ Engine e scena
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // 3️⃣ Camera fissa
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
    //camera.attachControl(canvas, true);

    // 4️⃣ Luce
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    // 5️⃣ Variabile globale per i mesh
    let meshes: any[] = [];

    // 6️⃣ Caricamento GLB
    (async () => {
        const result = await SceneLoader.ImportMeshAsync(null, "/srcs/pages/pubblic/AssetGlb/", "pong.glb", scene);
        meshes = result.meshes;
        console.log("Mesh caricati:", meshes.map(m => m.name));
		const offset = new Vector3(0, 3, -8); // sopra e indietroS
		camera.setPosition(meshes[3].position.add(offset));
		camera.target = meshes[2].position;
		//await engine.initAsync()
    })();

    // 7️⃣ Controllo tastiera per muovere il primo mesh
    window.addEventListener("keydown", (event) => {
        if (!meshes[0]) return; // assicurati che il mesh sia caricato
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

    // 8️⃣ Render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // 9️⃣ Resize
    window.addEventListener("resize", () => engine.resize());

    // 10️⃣ Cleanup
    return {
        el: canvas,
        cleanup: () => engine.dispose()
    };
};

