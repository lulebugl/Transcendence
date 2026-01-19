
import { useEffect, useRef, useState } from "react";
import { initWebSocket, sendMessage } from "./initWebSocket";
import { PongSceneManager } from "./PongScene";
import {
    BackendMessage,
    isGameOver,
    isReadyMessage,
    isStartMessage,
    isTimerMessage,
    isUpdateMessage,
    isErrorMsg,
} from "./PongTypes";
import { paddleLeft, paddleRight } from "./pong-helpers";
import { PongUIManager } from "./pongUI";
import { NOT_READY_INTERVAL } from "./PongConstants";
import { useNavigate } from "react-router";

export const usePongGame = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const [isLoading, setIsLoading] = useState(false);
    const sceneManagerRef = useRef<PongSceneManager | null>(null);
    const navigate = useNavigate();
    const websocketRef = useRef<WebSocket | null>(null);
    const paddlePlayerRef = useRef<number>(-1);
    const ReadyScene = useRef<boolean>(false);
    const lastNotReadyRef = useRef<number>(0);
    const uiManagerRef = useRef<PongUIManager | null>(null);

    const cleanupRef = useRef<() => void>(() => { });

    useEffect(() => {
        if (!canvasRef.current) return;

        let disposed = false;
        const sceneManager = new PongSceneManager(canvasRef.current, navigate);
        sceneManagerRef.current = sceneManager;

        const handleResize = () => sceneManager.resize();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!sceneManager.sceneReady || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) return;

            if ((event.key === "a" || event.key === "d") && paddlePlayerRef.current !== -1) {
                const playerMesh = sceneManager.meshes[paddlePlayerRef.current]?.getAbsolutePosition();
                websocketRef.current.send(JSON.stringify({
                    type: "playerMove",
                    key: event.key,
                    position: playerMesh
                }));
            }
        };

        const initGame = async () => {
            if (disposed) return;

            await sceneManager.loadAssets();
            if (disposed) return;


            // Setup UI
            const uiManager = new PongUIManager();
            uiManagerRef.current = uiManager;


            // WebSocket setup
            const params = new URLSearchParams(window.location.search);
            const matchId = params.get("matchId");
            const token = params.get('wsToken');

            if (matchId) {
                websocketRef.current = initWebSocket(`/ws?matchId=${matchId}&wsToken=${encodeURIComponent(token || '')}`, (data) => {
                    const msg = data as BackendMessage;

                    if (isReadyMessage(msg) && sceneManager.sceneReady === true) {
                        sendMessage({ type: "ready" }, websocketRef.current);
                    } else if (isStartMessage(msg)) {
                        paddlePlayerRef.current = msg.player === 1 ? paddleRight : paddleLeft;
                        if (sceneManager.sceneReady) {
                            sceneManager.moveCameraToPlayer(paddlePlayerRef.current);
                        }
                    } else if (isUpdateMessage(msg)) {
                        sceneManager.applyStateUpdate(msg);
                        uiManager.updateLeftScore(msg.state.paddleLeft.point);
                        uiManager.updateRightScore(msg.state.paddleRight.point);
                        uiManager.showPause(msg.state.break);
                    } else if (isTimerMessage(msg)) {
                        uiManager.updateTimer(msg.count);
                    } else if (isErrorMsg(msg)) {
                        console.log(msg.message);
                        navigate("/lobby");
                    } else if (isGameOver(msg)) {
                        if (websocketRef.current?.readyState === WebSocket.OPEN) {
                            websocketRef.current.close();
                        }

                        if (Number(msg.winner) === paddlePlayerRef.current) {
                            uiManager.setTimerText("You Win!");
                        } else if (Number(msg.winner) === 0) {
                            uiManager.hideTimer();
                            uiManager.setDrawText("Draw!");
                        } else {
                            uiManager.setTimerText("You Lose!");
                        }


                        setTimeout(() => {
                            cleanup();
                            navigate("/lobby");
                        }, 5000);
                    }
                });
            }


            sceneManager.startRenderLoop(() => {
            });

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("resize", handleResize);
        };

        // setTimeout needed to ensure the canvas is rendered in the DOM before initializing the engine
        const timeoutId = setTimeout(initGame, 50);

        const cleanup = () => {
            sceneManager.dispose();
            uiManagerRef.current?.dispose();
            if (websocketRef.current?.readyState === WebSocket.OPEN) {
                websocketRef.current.close();
            }
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
        };

        cleanupRef.current = cleanup;
        return () => {
            clearTimeout(timeoutId);
            disposed = true;
            cleanup();
        };

    }, [canvasRef, navigate]);

    return { isLoading, cleanup: cleanupRef.current };
};
