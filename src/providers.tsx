'use client'

import * as React from 'react'
import { WagmiProvider, http } from 'wagmi'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { polygon } from 'wagmi/chains'

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
const rpcUrl    = process.env.ALCHEMY_HTTP_URL || 'https://polygon-rpc.com'

const config = getDefaultConfig({
  appName: 'TLDraw NFT Gate',
  projectId,                           // ← ОБОВ’ЯЗКОВО
  chains: [polygon],
  transports: { [polygon.id]: http(rpcUrl) },
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
