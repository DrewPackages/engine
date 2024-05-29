import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [
    {
      id: 31337,
      name: "anvil",
      nativeCurrency: {
        name: "Anvil ETH",
        decimals: 18,
        symbol: "ETH",
      },
      rpcUrls: {
        default: {
          http: [import.meta.env.VITE_RPC_URL!],
        },
      },
    },
  ],
  connectors: [injected()],
  transports: {
    31337: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
