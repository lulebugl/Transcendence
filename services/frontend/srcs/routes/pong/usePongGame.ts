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
} from "./PongTypes";
import { paddleLeft, paddleRight } from "./pong-helpers";
import * as GUI from '@babylonjs/gui';
import { createPointBar, createExitGame, addText, createTimerBlock, updatePoint, pauseControl } from "./pongUI";
import { NOT_READY_INTERVAL } from "./PongConstants";

export const usePongGame = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const [isLoading, setIsLoading] = useState(false);
    const sceneManagerRef = useRef<PongSceneManager | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    const paddlePlayerRef = useRef<number>(-1);
    const ReadyScene = useRef<boolean>(false);
    const lastNotReadyRef = useRef<number>(0);

    // UI elements refs to update them without re-rendering react component
    const uiRefs = useRef<{
        timerBlock?: GUI.TextBlock;
        pintTextLeft?: GUI.TextBlock;
        pintTextRight?: GUI.TextBlock;
        drawText?: GUI.TextBlock;
    }>({});

    useEffect(() => {
        if (!canvasRef.current) return;

        let disposed = false;
        const sceneManager = new PongSceneManager(canvasRef.current);
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

            //console.log("sceneReady, sending ready");
            //sendMessage({ type: "ready" }, websocketRef.current);

            // Setup UI
            const uiGame = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            const barPointRight = createPointBar("100px", "60px", "pink", "black", 75, 0);
            const barPointLeft = createPointBar("100px", "60px", "white", "black", -75, 0);
            uiRefs.current.pintTextRight = addText(barPointRight, "white", 35);
            uiRefs.current.pintTextLeft = addText(barPointLeft, "white", 35);
            const exit = createExitGame();
            uiRefs.current.drawText = createTimerBlock();
            uiRefs.current.timerBlock = createTimerBlock();

            uiGame.addControl(barPointRight);
            uiGame.addControl(barPointLeft);
            // uiGame.addControl(exit);
            uiGame.addControl(uiRefs.current.timerBlock);
            uiGame.addControl(uiRefs.current.drawText);

            exit.onPointerUpObservable.add(() => {
                const message = paddlePlayerRef.current === paddleLeft ? "paddelLeft" : "paddelRight";
                cleanup();
                sendMessage({ type: "leave", text: message }, websocketRef.current);
                window.location.href = "/";
            });

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
                        if (uiRefs.current.pintTextLeft) updatePoint(uiRefs.current.pintTextLeft, msg.state.paddleLeft.point);
                        if (uiRefs.current.pintTextRight) updatePoint(uiRefs.current.pintTextRight, msg.state.paddleRight.point);
                        if (uiRefs.current.timerBlock) pauseControl(msg.state.break, uiRefs.current.timerBlock);
                    } else if (isTimerMessage(msg)) {
                        if (uiRefs.current.timerBlock) {
                            if (msg.count > 0) {
                                uiRefs.current.timerBlock.text = msg.count.toString();
                                uiRefs.current.timerBlock.isVisible = true;
                            } else {
                                uiRefs.current.timerBlock.isVisible = false;
                            }
                        }
                    } else if (isGameOver(msg)) {
                        if (websocketRef.current?.readyState === WebSocket.OPEN) {
                            websocketRef.current.close();
                        }
                        if (uiRefs.current.timerBlock && uiRefs.current.drawText) {
                            if (Number(msg.winner) === paddlePlayerRef.current) {
                                uiRefs.current.timerBlock.text = "You Win!";
                                uiRefs.current.timerBlock.isVisible = true;
                            } else if (Number(msg.winner) === 0) {
                                uiRefs.current.timerBlock.isVisible = false;
                                uiRefs.current.drawText.text = "Draw!";
                                uiRefs.current.drawText.isVisible = true;
                            } else {
                                uiRefs.current.timerBlock.text = "You Lose!";
                                uiRefs.current.timerBlock.isVisible = true;
                            }
                        }
                        setTimeout(() => {
                            cleanup();
                            window.location.href = "/lobby";
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
            if (websocketRef.current?.readyState === WebSocket.OPEN) {
                websocketRef.current.close();
            }
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
        };

        return () => {
            clearTimeout(timeoutId);
            disposed = true;
            cleanup();
        };

    }, []);

    return { isLoading };
};
