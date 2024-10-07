import { http, createConfig } from "@wagmi/core";
import { mainnet, arbitrum } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [mainnet, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
});
