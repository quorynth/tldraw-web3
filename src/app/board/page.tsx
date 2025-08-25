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

  // 1) Якщо не під’єднано — показуємо центрований екран
  if (!isConnected) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-4">TLDraw — SHADOW NFT Gate</h1>
          <p className="mb-6">Під’єднай гаманець, щоб увійти</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  // 2) Коли під’єднано — тягнемо роль
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!address) return
      try {
        setLoading(true)
        const res = await fetch(`/api/check-holder?user=${address}`, { cache: "no-store" })
        const json = await res.json()
        if (!cancelled) setRole((json.role as Role) ?? "none")
      } catch {
        if (!cancelled) setRole("none")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [address])

  if (loading || role === "idle") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">Перевіряємо доступ…</div>
      </div>
    )
  }

  if (role === "none") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Потрібний NFT не знайдено</h2>
          <p>Цей розділ доступний лише власникам відповідних NFT.</p>
        </div>
      </div>
    )
  }

  const readOnly = role === "reader"

  return (
    <div className="h-screen w-screen relative">
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
          className="fixed top-3 right-3 z-10 rounded-md border border-red-400 bg-red-50 px-3 py-1 font-semibold"
          role="status"
        >
          Reader mode: редагування вимкнено
        </div>
      )}
    </div>
  )
}
