

export const fetchPongAssets = async (assetPath: string = "/export_pongV0.5.glb"): Promise<void> => {
    try {
        await fetch(assetPath);
        console.log("Assets pre-fetched into browser cache");
    } catch (error) {
        console.error("Error pre-fetching Pong assets:", error);
    }
};
