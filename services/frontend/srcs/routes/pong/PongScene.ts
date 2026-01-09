import {
    AbstractMesh,
    ArcRotateCamera,
    Color4,
    Engine,
    HemisphericLight,
    Scene,
    Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import {
    ball,
    paddleLeft,
    paddleRight,
    updateMeshPosition,
} from "./pong-helpers";
import { ASSET_PATH, CAMERA_BASE_POSITION, CAMERA_TARGET, MOVING_MESH_INDICES } from "./PongConstants";
import { UpdateMessage } from "./PongTypes";
import { NavigateFunction } from "react-router";

// TODO: remove the logs when the game is stable and faster
export class PongSceneManager {
    public engine: Engine;
    public scene: Scene;
    public camera: ArcRotateCamera;
    public meshes: AbstractMesh[] = [];
    public sceneReady: boolean = false;
	public navigate: NavigateFunction;

    private offsetLeft = new Vector3(0, 10, -13);
    private offsetRight = new Vector3(0, 10, 13);

    constructor(canvas: HTMLCanvasElement, navigate: NavigateFunction) {
        console.time('[Pong] Engine creation');
        this.engine = new Engine(canvas, true);
        this.engine.setHardwareScalingLevel(
            Math.max(1, (window.devicePixelRatio || 1) * 0.75)
        );
        console.timeEnd('[Pong] Engine creation');

        console.time('[Pong] Scene setup');
        this.scene = new Scene(this.engine);
        this.navigate = navigate;
        this.scene.clearColor = new Color4(0, 0, 0, 1);
        this.scene.skipPointerMovePicking = true;
        this.scene.blockMaterialDirtyMechanism = true;

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 1;

        this.camera = new ArcRotateCamera(
            "camera",
            Math.PI / 2,
            Math.PI / 3,
            15,
            CAMERA_TARGET.clone(),
            this.scene
        );
        this.camera.position = CAMERA_BASE_POSITION.clone();
        this.camera.fov = 1.1;
        this.camera.minZ = 0.1;
        this.camera.maxZ = 2000;
        console.timeEnd('[Pong] Scene setup');
    }

    public async loadAssets(): Promise<void> {
        try {
            console.time('[Pong] GLB import');
            const result = await ImportMeshAsync(ASSET_PATH, this.scene);
            console.timeEnd('[Pong] GLB import');
            
            this.meshes = result.meshes;
            
            console.time('[Pong] Freeze meshes');
            this.freezeStaticMeshes();
            console.timeEnd('[Pong] Freeze meshes');
            
            this.sceneReady = true;
            console.log('[Pong] Scene ready!');
        } catch (error) {
            // use navigate instead of window.location.href for better state management
            this.navigate("/lobby");
            console.error("Error loading assets:", error);
        }
    }

    private freezeStaticMeshes() {
        this.meshes.forEach((mesh, index) => {
            if (!MOVING_MESH_INDICES.has(index) && mesh && mesh.isAnInstance === false) {
                try {
                    mesh.freezeWorldMatrix();
                } catch {
                    // ignore
                }
            }
        });
    }

    public applyStateUpdate(message: UpdateMessage) {
        if (!this.meshes.length) return;

        const ballMesh = this.meshes[ball];
        if (ballMesh) {
            updateMeshPosition(ballMesh, message.state.ball.position);
        }
        const leftMesh = this.meshes[paddleLeft];
        if (leftMesh) {
            updateMeshPosition(leftMesh, message.state.paddleLeft.position);
        }
        const rightMesh = this.meshes[paddleRight];
        if (rightMesh) {
            updateMeshPosition(rightMesh, message.state.paddleRight.position);
        }
    }

    public moveCameraToPlayer(player: number) {
        if (player === -1 || !this.camera || this.meshes.length === 0) return;

        const activeMesh = this.meshes[player];
        if (!activeMesh) return;

        const offset = player === paddleRight ? this.offsetRight : this.offsetLeft;
        const desiredPosition = activeMesh.getAbsolutePosition().add(offset);
        const targetMesh = this.meshes[0]; // Assuming 0 is board or central element? Or maybe ball? Original code used 0.

        this.camera.position = desiredPosition;
        this.camera.target = targetMesh.getAbsolutePosition();
    }

    public startRenderLoop(callback?: () => void) {
        this.engine.runRenderLoop(() => {
            this.scene.render();
            if (callback) callback();
        });
    }

    public dispose() {
        this.engine.stopRenderLoop();
        this.scene.dispose();
        this.engine.dispose();
    }

    public resize() {
        this.engine.resize();
    }
}
