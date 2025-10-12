import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from '@babylonjs/core';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new Engine(canvas, true);
const scene = new Scene(engine);

const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);

const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene);

// Simple pong-like scene placeholders
const table = MeshBuilder.CreateBox('table', { width: 6, depth: 10, height: 0.2 }, scene);
table.position.y = -0.2;

const paddleLeft = MeshBuilder.CreateBox('paddleLeft', { width: 1, height: 0.3, depth: 0.2 }, scene);
paddleLeft.position = new Vector3(-2.5, 0, 0);

const paddleRight = MeshBuilder.CreateBox('paddleRight', { width: 1, height: 0.3, depth: 0.2 }, scene);
paddleRight.position = new Vector3(2.5, 0, 0);

const ball = MeshBuilder.CreateSphere('ball', { diameter: 0.3 }, scene);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});

