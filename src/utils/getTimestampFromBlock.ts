import { ethers } from "ethers";
export const getTimestampFromBlock = async (blockNumber: any) => {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ARB_SEPOLIA_RPC);
    const block = await provider.getBlock(parseInt(blockNumber));
    return block?.timestamp ?? null;
  };