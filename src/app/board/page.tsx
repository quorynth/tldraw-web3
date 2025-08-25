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
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">TLDraw - SHADOW NFT Gate</h1>
      <p className="mb-6">Під’єднай гаманець, щоб увійти</p>
      <ConnectButton />
    </div>
  )
}

  if (loading || role === "idle") {
    return <div style={{ textAlign: "center", marginTop: 96 }}>Перевіряємо доступ…</div>
  }

  if (role === "none") {
    return (
      <div style={{ textAlign: "center", marginTop: 96 }}>
        <h2>Потрібний NFT не знайдено</h2>
        <p>Цей розділ доступний лише власникам відповідних NFT.</p>
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
