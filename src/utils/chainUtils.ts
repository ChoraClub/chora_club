export const getChainAddress = (chainName?: string): string | undefined => {
  if (chainName === "OP Mainnet") {
    return "0x4200000000000000000000000000000000000042";
  } else if (chainName === "Arbitrum One") {
    return "0x912CE59144191C1204E64559FE8253a0e49E6548";
  }
  return undefined;
};

export const getDaoName = (chainName?: string): string => {
  if (chainName === "OP Mainnet") {
    return "optimism";
  } else if (chainName === "Arbitrum One") {
    return "arbitrum";
  }
  return "";
};
