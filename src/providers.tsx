// src/providers.tsx
"use client"

import React from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { polygon } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string
if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined")
}

const rpcUrl = process.env.RPC_URL as string
if (!rpcUrl) {
  throw new Error("RPC_URL is not defined")
}

const chains = [polygon]

const config = createConfig({
  chains,
  transports: { [polygon.id]: http(rpcUrl) },
  ssr: true
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains
})

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
