"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`
const NFT_TYPE = (process.env.NEXT_PUBLIC_NFT_TYPE || "erc721").toLowerCase()
const NFT_TOKEN_ID =
  process.env.NEXT_PUBLIC_NFT_TOKEN_ID !== undefined
    ? Number(process.env.NEXT_PUBLIC_NFT_TOKEN_ID)
    : 0

export default function Page() {
  const { address, isConnected } = useAccount()
  const [hasNFT, setHasNFT] = useState<boolean | null>(null)

  useEffect(() => {
    let ignore = false
    async function check() {
      if (!isConnected || !address || !NFT_CONTRACT) {
        setHasNFT(null)
        return
      }
      const qs = new URLSearchParams({
        nft: NFT_CONTRACT,
        user: address,
        type: NFT_TYPE,
      })
      // для erc1155 додаємо tokenId
      if (NFT_TYPE === "erc1155") qs.set("tokenId", String(NFT_TOKEN_ID))

      try {
        const res = await fetch(`/api/check-holder?${qs.toString()}`, { cache: "no-store" })
        const json = await res.json()
        if (!ignore) setHasNFT(Boolean(json.held))
      } catch {
        if (!ignore) setHasNFT(false)
      }
    }
    check()
    return () => { ignore = true }
  }, [isConnected, address])

  // Ще не під’єднали гаманець – показуємо кнопки
  if (!isConnected) {
    return (
      <div style={{ textAlign: "center", marginTop: 96 }}>
        <h1>TLDraw NFT Gate</h1>
        <p>Під’єднай гаманець, щоб увійти</p>
          <div className="flex min-h-screen items-center justify-center">
            <ConnectButton />
          </div>
      </div>
    )
  }

  // Чекаємо перевірку
  if (hasNFT === null) {
    return <p style={{ textAlign: "center", marginTop: 96 }}>Перевіряю NFT…</p>
  }

  // Нема потрібного NFT – лишаємо на старті
  if (!hasNFT) {
    return (
      <div style={{ textAlign: "center", marginTop: 96 }}>
        <h2>Потрібний NFT не знайдено</h2>
        <ConnectButton />
      </div>
    )
  }

  // Є NFT – відкриваємо дошку
    return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Tldraw persistenceKey="gated-room" />
    </div>
  )
}
