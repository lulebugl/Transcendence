import { Vector3 } from "@babylonjs/core";
import { ball, paddleLeft, paddleRight } from "./pong-helpers";

export const ASSET_PATH = "/export_pongV0.5.glb";
export const NOT_READY_INTERVAL = 1000;
export const CAMERA_BASE_POSITION = new Vector3(0, 0, 0);
export const CAMERA_TARGET = new Vector3(0, 1000, 0);
export const MOVING_MESH_INDICES = new Set([ball, paddleLeft, paddleRight]);
