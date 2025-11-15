import { Light, AbstractMesh, PointLight, ImageProcessingConfiguration, Color4, ShadowGenerator, DirectionalLight, Color3, SpotLight, Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader } from "@babylonjs/core";


export const padelRight: number = 6;
export const padelLeft: number = 7;
export const table: number = 3;
export const ball: number = 5;

//♡♡♡♡♡♡♡♡♡HELPER: function for help   ♡♡♡♡♡♡♡♡♡

export function updateMeshPosition(mesh: AbstractMesh, pos: { x: number, y: number, z: number }) {
  mesh.position.set(pos.x, pos.y, pos.z);
}

export function upadateLightPosition(led: Light, pos: Vector3) {
  led.position = pos;
}


export function setLed(led: Light, x: number, y: number, z: number): void {
  const shadowRan = new ShadowGenerator(2048 * 2, led);
  shadowRan.useBlurExponentialShadowMap = true;
  shadowRan.blurKernel = 16;
  led.intensity = 7;
  led.diffuse = new Color3(x / 255, y / 255, z / 255);
}

export function setSpotLight(led: Light, intesitiyLight: number, rangeLight: number, meshe: AbstractMesh, shadow: boolean = false): void {
  const shadowRan = new ShadowGenerator(2048 * 2, led);
  shadowRan.useBlurExponentialShadowMap = true;
  shadowRan.blurKernel = 16;
  led.shadowEnabled = shadow;
  led.intensity = intesitiyLight;
  led.range = rangeLight;
  led.target = meshe;
}

export function setAmbientLight(led: Light, intesitiyLight: number, pos: Vector3 = led.position): void {
  const shadowRan = new ShadowGenerator(2048 * 2, led);
  shadowRan.useBlurExponentialShadowMap = true;
  shadowRan.blurKernel = 16;
  led.intensity = intesitiyLight;
  led.position = pos;
}

export var envHelperOpts: Partial = {
  skyboxSize: 300,
  skyboxColor: new Color3(0.9, 0.9, 0.9),
  clearColor: new Color4(0.02, 0.02, 0.04, 1),


  enableGroundMirror: false,
  groundColor: new Color3(0, 0, 0),
  groundSize: 0,
}


