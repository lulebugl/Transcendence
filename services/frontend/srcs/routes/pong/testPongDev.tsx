import { useEffect, useRef, useState } from "react";
import * as GUI from '@babylonjs/gui';
import {
    AbstractMesh,
    ArcRotateCamera,
    Color4,
    Engine,
    HemisphericLight,
    Scene,
    Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import {
    ball,
    paddleLeft,
    paddleRight,
    updateMeshPosition,
} from "./pong-helpers";
import { initWebSocket, sendMessage } from "./initWebSocket";
import { createPointBar, createExitGame, addText, updatePoint, createStartGame, createTimerBlock } from "./pongUI";
import { Loading } from "@/components/Loading";

const ASSET_PATH = "/export_pongV0.5.glb";
const NOT_READY_INTERVAL = 1000;
const CAMERA_BASE_POSITION = new Vector3(0, 0, 0);
const CAMERA_TARGET = new Vector3(0, 1000, 0);
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

type TimerMessage = {
    type: "timer";
    count: number;
};

const isTimerMessage = (message: BackendMessage): message is TimerMessage =>
    message?.type === "timer";

export const TestPongDev = () => {
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const cameraRef = useRef<ArcRotateCamera | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    const backendMessageRef = useRef<BackendMessage | null>(null);
    const sceneReadyRef = useRef<boolean>(false);
    const paddlePlayerRef = useRef<number>(-1);
    const meshesRef = useRef<AbstractMesh[]>([]);
    const lastNotReadyRef = useRef<number>(0);
    // const [timer, setTimer] = useState<number | null>(null); // Removed React state

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
        scene.clearColor = new Color4(0, 0, 0, 1);
        scene.skipPointerMovePicking = true;
        scene.blockMaterialDirtyMechanism = true;

        // Basic light to see the meshes
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 1;

        const camera = new ArcRotateCamera(
            "camera",
            Math.PI / 2,
            Math.PI / 3,
            15,
            CAMERA_TARGET.clone(),
            scene
        );
        camera.position = CAMERA_BASE_POSITION.clone();
        camera.fov = 1.1;
        camera.minZ = 0.1;
        camera.maxZ = 2000;
        cameraRef.current = camera;

        let disposed = false;

        loadAssets(scene).then(() => {
            if (!disposed) {
                sceneReadyRef.current = true;
                freezeStaticMeshes(meshesRef.current);
                sendMessage({ type: "ready" }, websocketRef.current);
                ////               setIsLoading(false);
            }
        });
        const uiGame = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const barPointRight = createPointBar("100px", "60px", "pink", "black", 75, 0);
        const barPointLeft = createPointBar("100px", "60px", "white", "black", -75, 0);
        const pintTextRight = addText(barPointRight, "white", 35);
        const pintTextLeft = addText(barPointLeft, "white", 35);
        const exit = createExitGame();
        // const start = createStartGame(); // Removed manual start
        const timerBlock = createTimerBlock();
        uiGame.addControl(barPointRight);
        uiGame.addControl(barPointLeft);
        uiGame.addControl(exit);
        uiGame.addControl(timerBlock);
        // uiGame.addControl(start);
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

        // Auto-start connection if matchId is present
        const params = new URLSearchParams(window.location.search);
        const matchId = params.get("matchId");
        const playerId = params.get("playerId");

        if (matchId && playerId) {
            websocketRef.current = initWebSocket(`/ws?matchId=${matchId}&playerId=${playerId}`, (data) => {
                const msg = data as BackendMessage;
                if (isStartMessage((msg))) {
                    paddlePlayerRef.current = msg.player === 1 ? paddleRight : paddleLeft;
                    if (sceneReadyRef.current === true) {
                        moveCameraToPlayer();
                        CameraFlag = true;
                    }
                    else {
                        CameraFlag = false;
                    }
                } else if (isTimerMessage(msg)) {
                    // setTimer(msg.count);
                    if (msg.count > 0) {
                        timerBlock.text = msg.count.toString();
                        timerBlock.isVisible = true;
                    } else {
                        timerBlock.isVisible = false;
                    }
                }
                backendMessageRef.current = msg;
                console.log(msg);
            });
            //            setIsLoading(false);
        }


        const handleResize = () => {
            engine.resize();
        };

        const renderLoop = () => {
            if (!sceneReadyRef.current || !scene || !engine) {
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
            console.log("funzione di uscita chiamata");
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
            cleanupGame();
        };
    }, []);
    const cleanupGame = () => {
        if (engineRef.current) {
            engineRef.current.stopRenderLoop();
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
            // No lights, shadows, or materials configuration
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
        // No light updates
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
            {!new URLSearchParams(window.location.search).get("matchId") && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">No Match ID</h2>
                        <p className="mb-4">Please join a game from the Lobby.</p>
                        <a href="/lobby" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Go to Lobby</a>
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                id="renderCanvas"
                className="block h-screen! w-screen outline-none"
                role="img"
                aria-label="Transcendence pong arena"
                tabIndex={0}
            />
        </div>
    );
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
