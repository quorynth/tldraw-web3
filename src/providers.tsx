"use client"
import { WagmiConfig, createConfig, http } from "wagmi"
import { base, polygon, mainnet } from "wagmi/chains"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "missing"
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 8453)
const chains = [base, polygon, mainnet].filter(c => [base.id, polygon.id, mainnet.id].includes(c.id))

const { wallets } = getDefaultWallets({ appName: "TLDraw Gate", projectId, chains })

const config = createConfig({
  chains,
  transports: {
    [base.id]: http(process.env.RPC_URL),
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
