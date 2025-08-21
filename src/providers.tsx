"use client"

import * as React from "react"
import {
  WagmiProvider,
  createConfig,
  http
} from "wagmi"
import { polygon } from "viem/chains"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://polygon-rpc.com"

const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(rpcUrl),
  },
  ssr: true,
})

export function Providers({ children }: { children: React.ReactNode }) {
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
