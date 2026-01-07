

export const Pong = () => {

};


const configureImageProcessing = (
  config: ImageProcessingConfiguration
): void => {
  config.toneMappingEnabled = true;
  config.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
  config.exposure = 1.2;
  config.contrast = 1.5;
  (config as any).gammaCorrection = true;
};


const configureShadows = (
  lights: Light[],
  meshes: AbstractMesh[]
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
  [paddleLeft, paddleRight, ball].forEach((index) => {
    if (meshes[index]) {
      shadowGen.addShadowCaster(meshes[index], true);
    }
  });
  const tableMesh = meshes[table];
  if (tableMesh) {
    tableMesh.receiveShadows = true;
  }
  return shadowGen;
};

const configureMaterials = (scene: Scene, meshes: AbstractMesh[]) => {
  meshes.forEach((mesh) => {
    const mat = mesh.material as unknown as Record<string, unknown> | undefined;
    if (mat && (mat as any).isPBRMaterial) {
      (mat as any).environmentIntensity = 3;
    }
  });
  scene.materials.forEach((material) => {
    (material as unknown as Record<string, unknown>).maxSimultaneousLights = 7;
  });
};
