import { useEffect, useRef } from "react";
import {
  Light,
  AbstractMesh,
  PointLight,
  ImageProcessingConfiguration,
  ShadowGenerator,
  DirectionalLight,
  SpotLight,
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import {
  updateMeshPosition,
  upadateLightPosition,
  setLed,
  setSpotLight,
  setAmbientLight,
  envHelperOpts,
  padelLeft,
  padelRight,
  table,
  ball,
} from "./pong-helpers";
import { initWebSocket, sendMessage } from "./initWebSocket";

export const Pong = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const backendMessageRef = useRef<unknown>(null);
  const sceneReadyRef = useRef<boolean>(false);
  const padelPlayerRef = useRef<number>(-1);
  const meshesRef = useRef<AbstractMesh[]>([]);
  const lightsRef = useRef<Light[]>([]);
  const pointLRef = useRef<Light[]>([]);
  const lastNotReadyRef = useRef<number>(0);
  const shadowGenRef = useRef<ShadowGenerator | null>(null);

  const offsetLeft = new Vector3(0, 8, -13); // player2
  const offsetRight = new Vector3(0, 8, 13); // player1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    websocketRef.current = initWebSocket("/ws", (data) => {
      backendMessageRef.current = data;
    });

    // Initialize Babylon.js Engine and Scene
    const engine = new Engine(canvas, true);
    engineRef.current = engine;
    engine.setHardwareScalingLevel(
      Math.max(1, window.devicePixelRatio ? window.devicePixelRatio * 0.75 : 1)
    );

    const scene = new Scene(engine);
    sceneRef.current = scene;

    scene.createDefaultEnvironment(envHelperOpts);
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.toneMappingType =
      ImageProcessingConfiguration.TONEMAPPING_ACES;
    scene.imageProcessingConfiguration.exposure = 1.2;
    scene.imageProcessingConfiguration.contrast = 1.5;
    (scene.imageProcessingConfiguration as any).gammaCorrection = true;

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2.2,
      10,
      new Vector3(0, 20, 0),
      scene
    );
    camera.fov = 1.1;
    camera.minZ = 0.1;
    camera.maxZ = 2000;
    cameraRef.current = camera;

    // Load assets asynchronously
    (async () => {
      try {
        const result = await SceneLoader.ImportMeshAsync(
          null,
          "/srcs/pages/pong/assets/AssetGlb/",
          "export_pongV0.2.glb",
          scene
        );
        meshesRef.current = result.meshes;
        console.log(
          "Mesh caricati:",
          meshesRef.current.map((m) => m.name)
        );
        console.log(
          "Mesh position",
          meshesRef.current.map((m) => m.position)
        );

        // Add Lights
        lightsRef.current = [
          new DirectionalLight(
            "DirectionalLight0",
            new Vector3(0, -1, 0),
            scene
          ),
          new SpotLight(
            "spotLight1",
            new Vector3(0, 2, 0),
            new Vector3(0, -1, 3),
            Math.PI / 3,
            20,
            scene
          ),
          new SpotLight(
            "spotLight2",
            new Vector3(0, 2, 0),
            new Vector3(0, -1, 3),
            Math.PI / 3,
            20,
            scene
          ),
        ];

        pointLRef.current = [
          new PointLight(
            "PointLightRight",
            meshesRef.current[padelRight]
              .getAbsolutePosition()
              .add(new Vector3(0, -3, 0)),
            scene
          ),
          new PointLight(
            "PointLightLeft",
            meshesRef.current[padelLeft]
              .getAbsolutePosition()
              .add(new Vector3(0, -3, 0)),
            scene
          ),
        ];

        console.log(lightsRef.current.map((m) => m.name));
        console.log(
          lightsRef.current.map((m) => (m as any).position ?? null)
        );

        // Setup intensity and color
        setSpotLight(
          lightsRef.current[2],
          100,
          20,
          meshesRef.current[padelLeft]
        );
        setSpotLight(
          lightsRef.current[1],
          100,
          20,
          meshesRef.current[padelRight]
        );
        setAmbientLight(lightsRef.current[0], 6);
        setLed(pointLRef.current[0], 0, 255, 0);
        setLed(pointLRef.current[1], 200, 0, 113);

        shadowGenRef.current = setupShadows(
          meshesRef.current,
          lightsRef.current
        );
        result.meshes.forEach((m) => {
          const mat = m.material;
          if (mat && (mat as any).isPBRMaterial) {
            (mat as any).environmentIntensity = 3;
          }
        });
        scene.materials.forEach(function (mtl) {
          (mtl as any).maxSimultaneousLights = 7;
        });

        sceneReadyRef.current = true;
      } catch (error) {
        console.error("Error loading assets:", error);
      }
    })();

    // Keyboard event handler
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
        padelPlayerRef.current !== -1
      ) {
        const clientMessage = {
          type: "playerMove",
          key: event.key,
          position:
            meshesRef.current[padelPlayerRef.current].getAbsolutePosition(),
        };
        websocketRef.current.send(JSON.stringify(clientMessage));
        console.log(clientMessage);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Render loop
    const renderLoop = () => {
      if (!sceneReadyRef.current || !scene || !engine) {
        return;
      }

      const backendMessage = backendMessageRef.current;

      if (
        backendMessage &&
        typeof backendMessage === "object" &&
        "type" in backendMessage
      ) {
        if (backendMessage.type === "update") {
          // Update all position assets
          updateMeshPosition(
            meshesRef.current[ball],
            (backendMessage as any).state.ball.position
          );
          updateMeshPosition(
            meshesRef.current[padelLeft],
            (backendMessage as any).state.padelLeft.position
          );
          updateMeshPosition(
            meshesRef.current[padelRight],
            (backendMessage as any).state.padelRight.position
          );
          upadateLightPosition(
            pointLRef.current[0],
            meshesRef.current[padelRight]
              .getAbsolutePosition()
              .add(new Vector3(0, -3, 0))
          );
          upadateLightPosition(
            pointLRef.current[1],
            meshesRef.current[padelLeft]
              .getAbsolutePosition()
              .add(new Vector3(0, -3, 0))
          );
        }
        // Set camera position
        else if (backendMessage.type === "start") {
          let offset: Vector3 | null = null;
          if ((backendMessage as any).player === 1) {
            padelPlayerRef.current = padelRight;
            offset = offsetRight;
            console.log("player1");
          } else if ((backendMessage as any).player === 2) {
            padelPlayerRef.current = padelLeft;
            offset = offsetLeft;
            console.log("player2");
          }
          if (padelPlayerRef.current !== -1 && cameraRef.current && offset) {
            cameraRef.current.setPosition(
              meshesRef.current[padelPlayerRef.current].position.add(offset)
            );
            cameraRef.current.target = meshesRef.current[0].position;
            console.log(cameraRef.current.position);
          }
        }
      }

      // FIXED: Throttle WebSocket "Not ready" messages to prevent spam (was sending 60+ per second!)
      // Send error if not have a valid ID player (throttled to max once per second)
      if (
        padelPlayerRef.current === -1 &&
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        const now = Date.now();
        if (now - lastNotReadyRef.current >= 1000) {
          sendMessage(
            { type: "Not ready", text: "Player not init" },
            websocketRef.current
          );
          lastNotReadyRef.current = now;
        }
      }

      scene.render();
    };

    engine.runRenderLoop(renderLoop);

    // Handle window resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      // Stop render loop
      engine.stopRenderLoop();

      // Remove event listeners
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);

      if (shadowGenRef.current) {
        shadowGenRef.current.dispose();
        shadowGenRef.current = null;
      }
      // Dispose Babylon.js resources
      if (scene) {
        scene.dispose();
      }
      if (engine) {
        engine.dispose();
      }

      // Close WebSocket
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.close();
      }
    };
  }, []);

  // Return JSX instead of an object
  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
    />
  );
};

const setupShadows = (
  meshes: AbstractMesh[],
  lights: Light[]
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

  const casters = [
    meshes[padelLeft],
    meshes[padelRight],
    meshes[ball],
  ].filter((mesh): mesh is AbstractMesh => Boolean(mesh));

  casters.forEach((mesh) => shadowGen.addShadowCaster(mesh, true));

  const tableMesh = meshes[table];
  if (tableMesh) {
    tableMesh.receiveShadows = true;
  }

  return shadowGen;
};
