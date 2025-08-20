"use client"

import { WagmiProvider, http } from "wagmi"
import { base, polygon, mainnet } from "wagmi/chains"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@rainbow-me/rainbowkit/styles.css"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "missing"

// Мережі, з якими працюємо (можеш залишити всі три)
const chains = [base, polygon, mainnet]

// Конфіг wagmi + RainbowKit v2: БЕЗ getDefaultWallets
const config = getDefaultConfig({
  appName: "TLDraw Gate",
  projectId,
  chains,
  transports: {
    // Якщо є RPC_URL для обраної мережі — підставляємо, інакше дефолтний
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
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
