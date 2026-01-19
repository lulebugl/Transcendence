
import { Vector3 } from "@babylonjs/core";

export type VectorPayload = { x: number; y: number; z: number };

export type UpdateMessage = {
    type: "update";
    state: {
        break: boolean;
        ball: { position: VectorPayload };
        paddleLeft: { position: VectorPayload, point: number };
        paddleRight: { position: VectorPayload, point: number };
    };
};

export type StartMessage = {
    type: "start";
    player: 1 | 2;
};
export type ErrorMsg = {
    type: "error";
    message: string;
};
// ReadyMessage definition was missing in original file, inferring from usage
export type ReadyMessage = {
    type: "ready?";
    // content might be extended
};

export type TimerMessage = {
    type: "timer";
    count: number;
};

export type GameOverMessage = {
    type: "gameOver";
    winner: number;
};

export type BackendMessage = UpdateMessage | StartMessage | ReadyMessage | TimerMessage | GameOverMessage | Record<string, unknown>;

export const isUpdateMessage = (message: BackendMessage): message is UpdateMessage =>
    message?.type === "update";

export const isReadyMessage = (message: BackendMessage): message is ReadyMessage =>
    message?.type === "ready?";

export const isStartMessage = (message: BackendMessage): message is StartMessage =>
    message?.type === "start";

export const isTimerMessage = (message: BackendMessage): message is TimerMessage =>
    message?.type === "timer";

export const isGameOver = (message: BackendMessage): message is GameOverMessage =>
    message?.type === "gameOver";

export const isErrorMsg = (message: BackendMessage): message is ErrorMsg =>
    message?.type === "error";