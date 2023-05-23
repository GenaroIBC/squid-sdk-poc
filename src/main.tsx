import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import "./styles/global.css"
import "@rainbow-me/rainbowkit/styles.css"
import {
  Chain,
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import ENV from "./config/env"

const avalancheChain: Chain = {
  id: 43_114,
  name: "Avalanche local",
  network: "avalanche",
  iconUrl: "https://axelarscan.io/logos/chains/avalanche.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX"
  },
  rpcUrls: {
    public: { http: [""] },
    default: {
      http: [ENV.AVALANCHE_RPC_ENDPOINT]
    }
  },
  testnet: true
}

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, avalancheChain],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] })
    })
  ]
)

const { connectors } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
