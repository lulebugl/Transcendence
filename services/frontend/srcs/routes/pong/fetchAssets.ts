import { ASSET_PATH } from "./PongConstants";

export const fetchPongAssets = async (assetPath: string = ASSET_PATH): Promise<void> => {
    try {
        await fetch(assetPath);
        console.log("Assets pre-fetched into browser cache");
    } catch (error) {
        console.error("Error pre-fetching Pong assets:", error);
    }
};
