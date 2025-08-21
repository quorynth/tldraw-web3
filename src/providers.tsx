// src/providers.tsx
"use client"

import React from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { polygon, mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"

const queryClient = new QueryClient()

// ⚡ Тут вставляєш свій projectId з WalletConnect (Web3Modal dashboard)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string

// ⚡ Вибираєш мережу: зараз polygon, але можеш лишити mainnet
const chains = [polygon, mainnet]

// Створюємо wagmi-конфіг
const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  }
})

// Ініціалізуємо Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
