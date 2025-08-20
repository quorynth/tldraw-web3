"use client"

import { WagmiProvider, http } from "wagmi"
import { base, polygon, mainnet } from "wagmi/chains"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@rainbow-me/rainbowkit/styles.css"

// WalletConnect Project ID (може бути тимчасовий)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "missing"

// Ланцюги, які будемо підтримувати
// Каст нижче усуває конфлікт типів між пакунками (wagmi/rainbowkit/viem)
const chains = [base, polygon, mainnet] as const

const config = getDefaultConfig({
  appName: "TLDraw Gate",
  projectId,
  // 👇 ключовий момент: дати TS «проковтнути» типи
  chains: chains as unknown as any,
  transports: {
    [base.id]: http(process.env.RPC_URL),
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
})

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
