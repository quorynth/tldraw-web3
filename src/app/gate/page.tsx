"use client"

import { useEffect } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function GatePage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      // Після під’єднання йдемо на дошку
      router.replace("/board")
    }
  }, [isConnected, router])

  return (
    <div style={{ textAlign: "center", marginTop: 96 }}>
      <h1>Portal entry.... </h1>
      <p>Connect your wallet to check NFT.</p>
      <div className="flex min-h-screen items-center justify-center">
        <ConnectButton />
      </div>
    </div>
  )
}
