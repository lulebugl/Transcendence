import { useEffect, useRef, useCallback, useState } from "react";
import * as GUI from '@babylonjs/gui';
import {
  StandardMaterial,
  HDRCubeTexture,
  CubeTexture,
  MeshBuilder,
  AbstractMesh,
  ArcRotateCamera,
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  ImageProcessingConfiguration,
  Light,
  PointLight,
  Scene,
  ShadowGenerator,
  SpotLight,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import {
  ball,
  envHelperOpts,
  paddleLeft,
  paddleRight,
  setAmbientLight,
  setLed,
  setSpotLight,
  table,
  updateLightPosition,
  updateMeshPosition,
} from "./pong-helpers";
import { initWebSocket, sendMessage } from "./initWebSocket";
import { createPointBar, createExitGame, addText, updatePoint } from "./pongUI";
import Loading from "@/components/Loading";

const ASSET_PATH = "/export_pongV0.5.glb";
const ASSET_PATH_HDRI = "/hdriV0.1.hdr";
const NOT_READY_INTERVAL = 1000;
const CAMERA_LERP = 0.08;
const LED_OFFSET = new Vector3(0, -3, 0);
const CAMERA_BASE_POSITION = new Vector3(0, 0, 0);
const CAMERA_TARGET = new Vector3(0, 0, 0);
const MOVING_MESH_INDICES = new Set([ball, paddleLeft, paddleRight]);

type VectorPayload = { x: number; y: number; z: number };

type UpdateMessage = {
  type: "update";
  state: {
    ball: { position: VectorPayload };
    paddleLeft: { position: VectorPayload, point: number };
    paddleRight: { position: VectorPayload, point: number };
  };
};

type StartMessage = {
  type: "start";
  player: 1 | 2;
};

type BackendMessage = UpdateMessage | StartMessage | Record<string, unknown>;

const isUpdateMessage = (message: BackendMessage): message is UpdateMessage =>
  message?.type === "update";

const isStartMessage = (message: BackendMessage): message is StartMessage =>
  message?.type === "start";

export const Pong = () => {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const backendMessageRef = useRef<BackendMessage | null>(null);
  const sceneReadyRef = useRef<boolean>(false);
  const paddlePlayerRef = useRef<number>(-1);
  const meshesRef = useRef<AbstractMesh[]>([]);
  const pointLightsRef = useRef<PointLight[]>([]);
  const shadowGenRef = useRef<ShadowGenerator | null>(null);
  const lastNotReadyRef = useRef<number>(0);

  const offsetLeft = useRef(new Vector3(0, 10, -13)); //Bianco
  const offsetRight = useRef(new Vector3(0, 10, 13)); // Viola

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }


    const engine = new Engine(canvas, true);
    engine.setHardwareScalingLevel(
      Math.max(1, (window.devicePixelRatio || 1) * 0.75)
    );
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    const hdrReflectionTexture = new HDRCubeTexture(ASSET_PATH_HDRI, scene, 128, false, true, false, true);
    const skyboxTexture = CubeTexture.CreateFromPrefilteredData(
      ASSET_PATH_HDRI,
      scene
    );
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 2000 }, scene);

    const skyboxMaterial = new StandardMaterial("skyBoxMat", scene);
    skyboxMaterial.reflectionTexture = skyboxTexture;
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;

    skybox.material = skyboxMaterial;


    scene.createDefaultEnvironment({
      ...envHelperOpts,
      skyboxColor: new Color3(0, 0, 0),
      clearColor: new Color4(0, 0, 0, 1),
      environmentTexture: hdrReflectionTexture,
    } as any);
    scene.clearColor = new Color4(0, 0, 0, 1);
    configureImageProcessing(scene.imageProcessingConfiguration);
    scene.skipPointerMovePicking = true;
    scene.blockMaterialDirtyMechanism = true;

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2.2,
      10,
      CAMERA_TARGET.clone(),
      scene
    );
    camera.position = CAMERA_BASE_POSITION.clone();
    camera.fov = 1.1;
    camera.minZ = 0.1;
    camera.maxZ = 2000;
    // moving camera
    //camera.attachControl(canvas, true);
    cameraRef.current = camera;

    let disposed = false;

    loadAssets(scene).then(() => {
      if (!disposed) {
        sceneReadyRef.current = true;
        freezeStaticMeshes(meshesRef.current);
        if (paddlePlayerRef.current !== -1) {
          setIsLoading(false);
        }
      }
    });
    const uiGame = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const barPointRight = createPointBar("100px", "60px", "pink", "black", 75, 0);
    const barPointLeft = createPointBar("100px", "60px", "white", "black", -75, 0);
    const pintTextRight = addText(barPointRight, "white", 35);
    const pintTextLeft = addText(barPointLeft, "white", 35);
    const exit = createExitGame();
    uiGame.addControl(barPointRight);
    uiGame.addControl(barPointLeft);
    uiGame.addControl(exit);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !sceneReadyRef.current ||
        !websocketRef.current ||
        websocketRef.current.readyState !== WebSocket.OPEN
      ) {
        return;
      }
      if (
        (event.key === "a" || event.key === "d") &&
        paddlePlayerRef.current !== -1
      ) {
        const playerMesh =
          meshesRef.current[paddlePlayerRef.current]?.getAbsolutePosition();
        const clientMessage = {
          type: "playerMove",
          key: event.key,
          position: playerMesh,
        };
        websocketRef.current.send(JSON.stringify(clientMessage));
      }
    };
    exit.onPointerUpObservable.add(() => {
      let message: string;
      if (paddlePlayerRef.current === paddleLeft) {
        message = "paddelLeft";
      }
      else {
        message = "paddelRight";
      }
      cleanupGame();
      sendMessage({ type: "leave", text: message }, websocketRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      window.location.href = "/";
    });

    let CameraFlag: boolean = false;
    websocketRef.current = initWebSocket("/ws", (data) => {
      const msg = data as BackendMessage;
      if (isStartMessage((msg))) {
        paddlePlayerRef.current = msg.player === 1 ? paddleRight : paddleLeft;
        if (sceneReadyRef.current === true) {
          moveCameraToPlayer();
          CameraFlag = true;
          setIsLoading(false);
        }
        else {
          CameraFlag = false;
        }
      }
      backendMessageRef.current = msg;
    });


    const handleResize = () => {
      engine.resize();
    };

    const renderLoop = () => {
      if (!sceneReadyRef.current || !scene || !engine || paddlePlayerRef.current === -1) {
        if (paddlePlayerRef.current === -1)
          maybeSendNotReady();
        return;
      }

      const backendMessage = backendMessageRef.current;
      if (backendMessage) {
        if (isUpdateMessage(backendMessage)) {
          applyStateUpdate(backendMessage);
          updatePoint(pintTextLeft, backendMessage.state.paddleLeft.point);
          updatePoint(pintTextRight, backendMessage.state.paddleRight.point);
        }
      }
      if (!CameraFlag && meshesRef.current.length > 0) {
        moveCameraToPlayer();
        CameraFlag = true;
      }
      scene.render();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    engine.runRenderLoop(renderLoop);

    return () => {
      disposed = true;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      cleanupGame();
    };
  }, []);
  const cleanupGame = () => {
    if (engineRef.current) {
      engineRef.current.stopRenderLoop();
    }


    if (shadowGenRef.current) {
      shadowGenRef.current.dispose();
      shadowGenRef.current = null;
    }
    if (sceneRef.current) {
      sceneRef.current.dispose();
      sceneRef.current = null;
    }
    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.close();
    }

    // rimuovi canvas se creato manualmente
    if (canvasRef.current) {
      canvasRef.current.remove();
    }
  };
  const loadAssets = async (scene: Scene) => {
    try {
      const result = await ImportMeshAsync(
        ASSET_PATH,
        scene
      );
      meshesRef.current = result.meshes;
      console.log("Mesh caricati:", result.meshes.map((m: any) => m.name));
      const { mainLights, accentLights } = createLights(scene);
      pointLightsRef.current = accentLights;
      configureLights(mainLights, accentLights, meshesRef.current);
      shadowGenRef.current = configureShadows(mainLights, meshesRef.current);
      configureMaterials(scene, result.meshes);
    } catch (error) {
      console.error("Error loading assets:", error);
    }
  };

  const applyStateUpdate = (message: UpdateMessage) => {
    const currentMeshes = meshesRef.current;
    const ballMesh = currentMeshes[ball];
    if (ballMesh) {
      updateMeshPosition(ballMesh, message.state.ball.position);
    }
    const leftMesh = currentMeshes[paddleLeft];
    if (leftMesh) {
      updateMeshPosition(leftMesh, message.state.paddleLeft.position);
    }
    const rightMesh = currentMeshes[paddleRight];
    if (rightMesh) {
      updateMeshPosition(rightMesh, message.state.paddleRight.position);
    }

    const paddleRightPos = rightMesh
      ?.getAbsolutePosition()
      .add(LED_OFFSET);
    const paddleLeftPos = leftMesh
      ?.getAbsolutePosition()
      .add(LED_OFFSET);

    if (pointLightsRef.current[0] && paddleRightPos) {
      updateLightPosition(pointLightsRef.current[0], paddleRightPos);
    }
    if (pointLightsRef.current[1] && paddleLeftPos) {
      updateLightPosition(pointLightsRef.current[1], paddleLeftPos);
    }
  };

  const moveCameraToPlayer = (instant: boolean = false) => {
    if (paddlePlayerRef.current === -1 || !cameraRef.current || meshesRef.current.length === 0) {
      return;
    }
    const activeMesh = meshesRef.current[paddlePlayerRef.current];
    if (!activeMesh) {
      return;
    }
    const offset =
      paddlePlayerRef.current === paddleRight
        ? offsetRight.current
        : offsetLeft.current;
    const desiredPosition = activeMesh.getAbsolutePosition().add(offset);
    //const currentCamera = cameraRef.current;
    const targetMesh = meshesRef.current[0];
    cameraRef.current.position = desiredPosition;
    cameraRef.current.target = targetMesh.getAbsolutePosition();
  };

  const maybeSendNotReady = () => {
    if (
      paddlePlayerRef.current !== -1 ||
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }
    const now = Date.now();
    if (now - lastNotReadyRef.current >= NOT_READY_INTERVAL) {
      sendMessage(
        { type: "Not ready", text: "Player not init" },
        websocketRef.current
      );
      lastNotReadyRef.current = now;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50">
          <Loading />
        </div>
      )}
      <canvas
        ref={canvasRef}
        id="renderCanvas"
        className="block h-screen w-screen outline-none"
        role="img"
        aria-label="Transcendence pong arena"
        tabIndex={0}
      />
    </div>
  );
};

const configureImageProcessing = (
  config: ImageProcessingConfiguration
): void => {
  config.toneMappingEnabled = true;
  config.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
  config.exposure = 1.2;
  config.contrast = 1.5;
  (config as any).gammaCorrection = true;
};

const createLights = (scene: Scene) => {
  const directional = new DirectionalLight(
    "DirectionalLight0",
    new Vector3(0, -1, 0),
    scene
  );
  const spotRight = new SpotLight(
    "spotLight1",
    new Vector3(0, 2, 0),
    new Vector3(0, -1, 3),
    Math.PI / 3,
    20,
    scene
  );
  const spotLeft = new SpotLight(
    "spotLight2",
    new Vector3(0, 2, 0),
    new Vector3(0, -1, 3),
    Math.PI / 3,
    20,
    scene
  );
  const dummyPoint = new PointLight("point0", new Vector3(0, 0, 0), scene);
  const dummyPoint2 = new PointLight("point1", new Vector3(0, 0, 0), scene);
  return {
    mainLights: [directional, spotRight, spotLeft],
    accentLights: [dummyPoint, dummyPoint2],
  };
};

const configureLights = (
  lights: Light[],
  pointLights: PointLight[],
  meshes: AbstractMesh[]
) => {
  if (lights.length < 3) {
    return;
  }
  if (meshes[paddleLeft]) {
    setSpotLight(lights[2], 100, 20, meshes[paddleLeft]);
  }
  if (meshes[paddleRight]) {
    setSpotLight(lights[1], 100, 20, meshes[paddleRight]);
  }
  setAmbientLight(lights[0], 6);
  if (pointLights[0]) {
    setLed(pointLights[0], 0, 255, 0);
    if (meshes[paddleRight]) {
      pointLights[0].position = meshes[paddleRight]
        .getAbsolutePosition()
        .add(LED_OFFSET);
    }
  }
  if (pointLights[1]) {
    setLed(pointLights[1], 200, 0, 113);
    if (meshes[paddleLeft]) {
      pointLights[1].position = meshes[paddleLeft]
        .getAbsolutePosition()
        .add(LED_OFFSET);
    }
  }
};

const configureShadows = (
  lights: Light[],
  meshes: AbstractMesh[]
): ShadowGenerator | null => {
  const directionalLight = lights[0] as DirectionalLight | undefined;
  if (!directionalLight) {
    return null;
  }
  directionalLight.shadowEnabled = true;
  const mapSize = window.innerWidth >= 1280 ? 2048 : 1024;
  const shadowGen = new ShadowGenerator(mapSize, directionalLight);
  shadowGen.usePercentageCloserFiltering = true;
  shadowGen.filteringQuality = ShadowGenerator.QUALITY_HIGH;
  shadowGen.bias = 0.0008;
  shadowGen.normalBias = 0.04;
  shadowGen.transparencyShadow = true;
  [paddleLeft, paddleRight, ball].forEach((index) => {
    if (meshes[index]) {
      shadowGen.addShadowCaster(meshes[index], true);
    }
  });
  const tableMesh = meshes[table];
  if (tableMesh) {
    tableMesh.receiveShadows = true;
  }
  return shadowGen;
};

const configureMaterials = (scene: Scene, meshes: AbstractMesh[]) => {
  meshes.forEach((mesh) => {
    const mat = mesh.material as unknown as Record<string, unknown> | undefined;
    if (mat && (mat as any).isPBRMaterial) {
      (mat as any).environmentIntensity = 3;
    }
  });
  scene.materials.forEach((material) => {
    (material as unknown as Record<string, unknown>).maxSimultaneousLights = 7;
  });
};

const freezeStaticMeshes = (meshes: AbstractMesh[]) => {
  meshes.forEach((mesh, index) => {
    if (!MOVING_MESH_INDICES.has(index) && mesh && mesh.isAnInstance === false) {
      try {
        mesh.freezeWorldMatrix();
      } catch {
        // ignore freeze errors for meshes that cannot be frozen
      }
    }
  });
};
