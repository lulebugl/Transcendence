import { PBRMaterial, Light, AbstractMesh, PointLight, ImageProcessingConfiguration, Color4, ShadowGenerator, DirectionalLight, Color3, SpotLight, Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader } from "@babylonjs/core";
import { Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/loaders";
import { updateMeshPosition, upadateLightPosition, setLed, setSpotLight, setAmbientLight, envHelperOpts, padelLeft, padelRight, table, ball } from "./helpersBaby";
import { initWebSocket, sendMessage } from "./initWebSocket";

export const Game: Page = () => {
  let SceneRedy: boolean = false;
  //♡♡♡♡♡♡♡♡♡SETUP: websocket client  ♡♡♡♡♡♡♡♡♡
  //
  const wsUri: string = "/ws";
  let backendMessage: any;
  const websocket: WebSocket = initWebSocket(wsUri, (data) => {
    backendMessage = data;
  }
  );

  const canvas = document.createElement("canvas");
  canvas.id = "renderCanvas";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.display = "block";
  document.body.appendChild(canvas);

  //♡♡♡♡♡♡♡♡♡ALL start variable♡♡♡♡♡♡♡♡♡
  let padelPlayer: number = -1;
  const offsetLeft: Vector3 = new Vector3(0, 8, -13); //player2
  const offsetRight: Vector3 = new Vector3(0, 8, 13); //player1
  let meshes: AbstractMesh[] = [];
  let lights: Light[];
  let pointL: Light[];

  const engine = new Engine(canvas, true);
  const scene: Scene = new Scene(engine);
  scene.createDefaultEnvironment(envHelperOpts);
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
  scene.imageProcessingConfiguration.exposure = 1.2;
  scene.imageProcessingConfiguration.contrast = 1.5;
  scene.imageProcessingConfiguration.gammaCorrection = true;
  const camera: ArcRotateCamera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.2, 10, new Vector3(0, 20, 0), scene);
  camera.fov = 1.1;
  camera.minZ = 0.1;
  camera.maxZ = 2000;

  //♡♡♡♡♡♡♡♡♡ Import all asset ♡♡♡♡♡♡♡♡♡
  (async () => {
    const result: AbstractMesh = await SceneLoader.ImportMeshAsync(null, "/srcs/pages/pubblic/AssetGlb/", "export_pongV0.2.glb", scene);
    meshes = result.meshes;
    console.log("Mesh caricati:", meshes.map(m => m.name));
    console.log("Mesh position", meshes.map(m => m.position));
    //♡♡♡♡♡♡♡♡♡ ADD Light ♡♡♡♡♡♡♡♡♡
    lights = [
      new DirectionalLight("DirectionalLight0", new Vector3(0, -1, 0), scene),
      new SpotLight("spotLight1", (new Vector3(0, 2, 0)), new Vector3(0, -1, 3), Math.PI / 3, 20, scene),
      new SpotLight("spotLight2", (new Vector3(0, 2, 0)), new Vector3(0, -1, 3), Math.PI / 3, 20, scene),
    ];
    pointL = [
      new PointLight("PointLightRight", meshes[padelRight].getAbsolutePosition().add(new Vector3(0, -3, 0)), scene),
      new PointLight("PointLightLeft", meshes[padelLeft].getAbsolutePosition().add(new Vector3(0, -3, 0)), scene),
    ];
    console.log(lights.map(m => m.name));
    console.log(lights.map(m => m.position));
    //♡♡♡♡♡♡♡♡♡ SETUP intensity ♡♡♡♡♡♡♡♡♡
    // ♡♡♡♡♡♡♡♡♡ SETUP color Light  ♡♡♡♡♡♡♡♡♡
    setSpotLight(lights[2], 100, 20, meshes[padelLeft]);
    setSpotLight(lights[1], 100, 20, meshes[padelRight]);
    setAmbientLight(lights[0], 6);
    setLed(pointL[0], 0, 255, 0);
    setLed(pointL[1], 200, 0, 113);

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
        mat.environmentIntensity = 3;
        //mat.microSurface = 0.7;
      }
    });
    scene.materials.forEach(function(mtl) {
      mtl.maxSimultaneousLights = 7;
    });
    SceneRedy = true;
  })();

  window.addEventListener("keydown", (event) => {
    if (!SceneRedy || websocket.readyState !== websocket.OPEN)
      return;
    if ((event.key === "a" || event.key === "d") && padelPlayer != -1) {
      const clientMessage = {
        type: "playerMove",
        key: event.key,
        position: meshes[padelPlayer].getAbsolutePosition()
      };
      websocket.send(JSON.stringify(clientMessage));
      console.log(clientMessage);
    }
  });

  engine.runRenderLoop(() => {
    if (!SceneRedy) {
      return;
    }
    if (backendMessage && backendMessage.type === 'update') {
      //♡♡♡♡♡♡♡♡♡ UPADET ALL POSITION ASSET ♡♡♡♡♡♡♡♡♡
      updateMeshPosition(meshes[ball], backendMessage.state.ball.position);
      updateMeshPosition(meshes[padelLeft], backendMessage.state.padelLeft.position);
      updateMeshPosition(meshes[padelRight], backendMessage.state.padelRight.position);
      upadateLightPosition(pointL[0], meshes[padelRight].getAbsolutePosition().add(new Vector3(0, -3, 0)));
      upadateLightPosition(pointL[1], meshes[padelLeft].getAbsolutePosition().add(new Vector3(0, -3, 0)));
    }
    //♡♡♡♡♡♡♡♡♡ SET CAMERA POSITION ♡♡♡♡♡♡♡♡♡
    else if (backendMessage && backendMessage.type === "start") {
      let offset: Vector3;
      if (backendMessage.player === 1) {
        padelPlayer = padelRight;
        offset = offsetRight;
        console.log("player1");
      }
      else if (backendMessage.player === 2) {
        padelPlayer = padelLeft;
        offset = offsetLeft;
        console.log("player2");
      }
      if (padelPlayer != -1) {
        camera.setPosition(meshes[padelPlayer].position.add(offset));
        camera.target = meshes[0].position;
        console.log(camera.position);
      }
    }
    //♡♡♡♡♡♡♡♡♡ SEND ERROR IF NOT HAVE A VALID ID PLAYER ♡♡♡♡♡♡♡♡♡
    else if (padelPlayer === -1) {
      sendMessage({ type: "Not ready", text: "Player not init" }, websocket);
    }
    else {
      return;
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
