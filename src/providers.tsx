"use client"

import React, { useEffect, useMemo } from "react"
import { WagmiConfig, createConfig } from "wagmi"
import { http } from "viem"
import { mainnet, polygon, base } from "wagmi/chains"
import { createWeb3Modal } from "@web3modal/wagmi/react"

type Props = { children: React.ReactNode }

function pickChain(chainId: number) {
  switch (chainId) {
    case 1: return mainnet
    case 137: return polygon
    case 8453: return base
    default: return polygon
  }
}

export default function Providers({ children }: Props) {
  // ---- ENV (публічні та приватні) ----
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  const chainIdStr = process.env.NEXT_PUBLIC_CHAIN_ID || "137"
  const rpcUrl = process.env.RPC_URL

  if (!projectId) throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined")
  if (!rpcUrl) throw new Error("RPC_URL is not defined")

  const chainId = Number(chainIdStr)
  const chain = pickChain(Number.isFinite(chainId) ? chainId : 137)
  const chains = useMemo(() => [chain], [chain])

  // ---- wagmi config (viem http транспорт з твого RPC_URL) ----
  const wagmiConfig = useMemo(() => {
    return createConfig({
      chains,
      transports: { [chain.id]: http(rpcUrl) },
      autoConnect: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain.id, rpcUrl])

  // ---- ініціалізація Web3Modal ТІЛЬКИ в браузері ----
  useEffect(() => {
    // створюємо модалку один раз після маунта
    createWeb3Modal({
      projectId,
      wagmiConfig,
      chains,
      enableAnalytics: false, // щоб зайвого не тягнуло під час білду
    })
  }, [projectId, wagmiConfig, chains])

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
