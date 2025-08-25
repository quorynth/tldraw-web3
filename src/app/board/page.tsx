"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Tldraw } from "@tldraw/tldraw"

type Role = "idle" | "none" | "reader" | "writer"

export default function BoardPage() {
  const { address, isConnected } = useAccount()
  const [role, setRole] = useState<Role>("idle")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!isConnected || !address) {
        setRole("idle")
        return
      }
      try {
        setLoading(true)
        const res = await fetch(`/api/check-holder?user=${address}`, { cache: "no-store" })
        const { role } = await res.json()
        if (!cancelled) setRole(role as Role ?? "none")
      } catch {
        if (!cancelled) setRole("none")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [isConnected, address])

if (!isConnected) {
  return (
      <div style={{ textAlign: "center", marginTop: 96 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}>
          <h1>TLDraw NFT Gate</h1>
          <p>Connect your wallet to check NFT</p>        
          <ConnectButton />
        </div>
      </div>
  )
}

  if (loading || role === "idle") {
    return <div style={{ textAlign: "center", marginTop: 96 }}>Перевіряємо доступ…</div>
  }

  if (role === "none") {
    return (
      <div style={{ textAlign: "center", marginTop: 96 }}>
        <h2>Required NFT not found</h2>
        <p>Access to this section is restricted to owners of special NFTs</p>
      </div>
    )
  }

  const readOnly = role === "reader"

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Tldraw
        persistenceKey="gated-room"
        onMount={(editor) => {
          if (readOnly) {
            editor.updateInstanceState({ isReadonly: true })
          }
        }}
      />

      {readOnly && (
        <div
          style={{
            position: "fixed",
            top: 12,
            right: 12,
            padding: "6px 10px",
            background: "#ffeded",
            border: "1px solid #f66",
            borderRadius: 6,
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          Reader mode: редагування вимкнено
        </div>
      )}
    </div>
  )
}
