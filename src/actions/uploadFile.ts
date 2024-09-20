import lighthouse from "@lighthouse-web3/sdk";
import { NFT_LIGHTHOUSE_BASE_API_KEY } from "@/config/constants";
import { Buffer } from "buffer";

export const uploadFile = async (arrayBuffer: ArrayBuffer) => {
  // console.log("arrayBuffer", arrayBuffer);
  try {
    const apiKey = NFT_LIGHTHOUSE_BASE_API_KEY || "";
    if (!apiKey) {
      throw new Error("Lighthouse API key is not set");
    }

    const file = Buffer.from(arrayBuffer);

    console.log("file:::", file);
    const files = new File([file], "image.png", { type: "image/png" });

    const uploadResponse = await lighthouse.uploadBuffer(file, apiKey);

    if (!uploadResponse || !uploadResponse.data) {
      throw new Error("Upload failed: Invalid response from Lighthouse");
    }

    // console.log("Upload successful:", uploadResponse.data);
    return uploadResponse.data;
  } catch (error: any) {
    console.error("Error uploading to Lighthouse:", error.message);
    throw error;
  }
};
