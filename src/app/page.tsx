"use client"

import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"
import { useEffect, useState } from "react"

export default function Page() {
  const { address, isConnected } = useAccount()
  const [hasNFT, setHasNFT] = useState<boolean | null>(null)

  useEffect(() => {
    if (isConnected && address) {
      fetch(`/api/check-holder?nft=${process.env.NEXT_PUBLIC_NFT_CONTRACT}&user=${address}&type=erc721`)
        .then(res => res.json())
        .then(data => setHasNFT(data.held))
        .catch(() => setHasNFT(false))
    } else {
      setHasNFT(null)
    }
  }, [isConnected, address])

  if (!isConnected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}>
        <h1>Connect your wallet to continue</h1>
        <ConnectButton />
      </div>
    )
  }

  if (hasNFT === false) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>You don’t own the required NFT 😢</h2>
        <ConnectButton />
      </div>
    )
  }

  if (hasNFT === null) {
    return <p style={{ textAlign: "center", marginTop: 100 }}>Checking your wallet…</p>
  }

  return <Tldraw />
}
