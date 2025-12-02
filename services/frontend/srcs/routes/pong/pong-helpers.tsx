import { Light, AbstractMesh, Color4, Color3, Vector3 } from "@babylonjs/core";

export const paddleRight: number = 8;
export const paddleLeft: number = 11;
export const table: number = 3;
export const ball: number = 16;

export function updateMeshPosition(mesh: AbstractMesh, pos: { x: number, y: number, z: number }) {
  mesh.position.set(pos.x, pos.y, pos.z);
}

export function updateLightPosition(led: Light, pos: Vector3) {
  (led as any).position = pos;
}


export function setLed(led: Light, x: number, y: number, z: number): void {
  led.intensity = 7;
  led.diffuse = new Color3(x / 255, y / 255, z / 255);
}

export function setSpotLight(
  led: Light,
  intesitiyLight: number,
  rangeLight: number,
  meshe: AbstractMesh
): void {
  led.shadowEnabled = false;
  led.intensity = intesitiyLight;
  led.range = rangeLight;
  (led as any).target = meshe;
}

export function setAmbientLight(led: Light, intesitiyLight: number, pos?: Vector3): void {
  led.intensity = intesitiyLight;
  const targetPosition = pos ?? (led as any).position;
  if (targetPosition) {
    (led as any).position = targetPosition;
  }
}

export const envHelperOpts: Partial<Record<string, unknown>> = {
  clearColor: new Color4(0.02, 0.02, 0.04, 1),


  enableGroundMirror: false,
  groundColor: new Color3(0, 0, 0),
  groundSize: 0,
}


