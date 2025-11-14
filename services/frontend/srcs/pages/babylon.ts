import {  RectAreaLight, PointLight, ImageProcessingConfiguration, Color4, ShadowGenerator, DirectionalLight, Color3, SpotLight, Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader, Matrix } from "@babylonjs/core";
import { Vector3, Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
const	padelRight = 5;
const	padelLeft = 6;
const	table = 3;
const	ball = 7;

export const Game: Page = () => {
	//♡♡♡♡♡♡♡♡♡ALL start variable♡♡♡♡♡♡♡♡♡
	let backendMessage;
	const wsUri = "/ws";
	let padelPlayer = -1;
	const offsetLeft = new Vector3(0, 8, -13); //player2
	const offsetRight = new Vector3(0, 8, 13); //player1
	const websocket = new WebSocket(wsUri);
  let meshes: any[] = [];

	//♡♡♡♡♡♡♡♡♡SETUP: websocket client  ♡♡♡♡♡♡♡♡♡
	(async () => {
		// mi collego
		console.log("Provo a collegarmi");
		websocket.addEventListener("open", () => {
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
			//console.log(backendMessage);
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
  function setLed(led: PointLight, x: number, y: number, z: number) {
    const shadowRan = new ShadowGenerator(2048 * 2, led);
    shadowRan.useBlurExponentialShadowMap = true;
    shadowRan.blurKernel = 16;
    led.intensity = 5;
    led.diffuse = new Color3(x, y, z);
  }


    const canvas = document.createElement("canvas");
    canvas.id = "renderCanvas";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.display = "block";
    document.body.appendChild(canvas);
    var envHelperOpts:Partial = {
    skyboxSize: 1000,
    skyboxColor: new Color3(0.03, 0.03, 0.03),
    clearColor: new Color4(0.02, 0.02, 0.04, 1),


    enableGroundMirror: false,
    groundColor: new Color3(0, 0, 0),
    groundSize: 0,
    //groundShadowLevel: 
    }

  const engine = new Engine(canvas, true);
  const scene:  scene = new Scene(engine);
  const env = scene.createDefaultEnvironment(envHelperOpts);
  //scene.imageProcessingConfiguration.toneMappingEnabled = true;
  //scene.imageProcessingConfiguration.exposure = 1.2;
  //groundShadowLevel: numberu
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
scene.imageProcessingConfiguration.exposure = 1.2;
scene.imageProcessingConfiguration.contrast = 1.5;
scene.imageProcessingConfiguration.gammaCorrection = true;
const camera:  camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.2, 10, new Vector3(0, 20, 0), scene);
  camera.fov = 1.1;  // meno distorsione
  camera.minZ = 0.1; // meno clipping
  camera.maxZ = 2000;

	//const lightada = new HemisphericLight("light", camera.position);
  //♡♡♡♡♡♡♡♡♡ Import all asset ♡♡♡♡♡♡♡♡♡
    (async () => {
        const result = await SceneLoader.ImportMeshAsync(null, "/srcs/pages/pubblic/AssetGlb/", "export_pongV0.1.glb", scene);
        meshes = result.meshes;
        console.log("Mesh caricati:", meshes.map(m => m.name));
        console.log("Mesh position", meshes.map(m => m.position));
  //♡♡♡♡♡♡♡♡♡ ADD tre spotLigt ♡♡♡♡♡♡♡♡♡
        const lights: SpotLight[] = [
          new DirectionalLight("DirectionalLight0", new Vector3(0, -1, 0), scene),
          new SpotLight("spotLight1", (new Vector3(0, 8, 0)), new Vector3(0, -1, 1).normalize(), Math.PI / 2, 1, scene),
          new SpotLight("spotLight2", (new Vector3(0, 8, 0)), new Vector3(0, -1, -1).normalize(), Math.PI / 2, 1, scene),
        ];
//    meshes.forEach(n => {
//    n.position = n.position.normalize();
//});


        console.log(lights.map(m => m.name));
        console.log(lights.map(m => m.position));
        //♡♡♡♡♡♡♡♡♡ SETUP intensity ♡♡♡♡♡♡♡♡♡
  // ♡♡♡♡♡♡♡♡♡ SETUP color SpotLight  ♡♡♡♡♡♡♡♡♡
    //
       lights[0].intensity = 7;
       lights[1].intensity = 150;
       lights[2].intensity = 150;
       lights[1].range = 100;
       lights[2].range = 100;
      lights[1].shadowEnabled = false;
      lights[2].shadowEnabled = false;
      lights[1].target = meshes[padelLeft];
      lights[2].target = meshes[padelRight];
    const shadowGen = new ShadowGenerator(2048 * 2, lights[0]);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 16;

    shadowGen.addShadowCaster(meshes[padelLeft]);
    shadowGen.addShadowCaster(meshes[padelRight]);
    shadowGen.addShadowCaster(meshes[ball]);
    
    meshes[table].receiveShadows = true;
    result.meshes.forEach(m => {
    const mat = m.material;
    if (mat && mat.isPBRMaterial) {
     mat.environmentIntensity = 1.5;
  }
});
  })();

	window.addEventListener("keydown", (event) =>{
		if (!meshes[0] || websocket.readyState !== websocket.OPEN)
			return ;
        if (event.key === "a" || event.key === "d" && padelPlayer != -1){
			const clientMessage = {
            type: "playerMove",
            key: event.key,
            position: meshes[padelPlayer].getAbsolutePosition()
			};
			websocket.send(JSON.stringify(clientMessage));
      console.log(clientMessage);
		}
	});

      const ledRight = new PointLight("pointLightRigth", new Vector3(0, -1.5, 0), scene);
      const ledLeft = new PointLight("pointLightLeft", new Vector3(0, -1.5, 0), scene);
  setLed(ledLeft, 0, 1, 0);
  setLed(ledRight, 1, 0, 3);
    engine.runRenderLoop(() => {
		if (!meshes[0]){
			return ;
		}
		if (backendMessage && backendMessage.type === 'update'){
      //♡♡♡♡♡♡♡♡♡ UPADET ALL POSITION ASSET ♡♡♡♡♡♡♡♡♡
		meshes[ball].position.y = backendMessage.state.ball.position.y;
		meshes[ball].position.x = backendMessage.state.ball.position.x;
		meshes[ball].position.z = backendMessage.state.ball.position.z;

		meshes[padelRight].position.x = backendMessage.state.padelRight.position.x; 
		meshes[padelRight].position.y = backendMessage.state.padelRight.position.y;
		meshes[padelRight].position.z = backendMessage.state.padelRight.position.z;

		meshes[padelLeft].position.x = backendMessage.state.padelLeft.position.x; 
		meshes[padelLeft].position.y = backendMessage.state.padelLeft.position.y;
		meshes[padelLeft].position.z = backendMessage.state.padelLeft.position.z;
    ledRight.parent = meshes[padelRight];
    ledLeft.parent = meshes[padelLeft];
		}
		else if (backendMessage && backendMessage.type === "start"){
			let offset;
			if (backendMessage.player === 1){
				padelPlayer = padelRight;
				offset = offsetRight;
				console.log("player1");
			}
			else if (backendMessage.player === 2){
				padelPlayer = padelLeft;
				offset = offsetLeft;
				console.log("player2");
			}
      if (padelPlayer != -1){
        camera.setPosition(meshes[padelPlayer].position.add(offset));
        camera.target = meshes[0].position;
        console.log(camera.position);
      }
		}
    else if(padelPlayer === -1 ){
			sendMessage({ type: "Not ready", text: "Player not init" });
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
