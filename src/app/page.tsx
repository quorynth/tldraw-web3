"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`

export default function Page() {
  const { address, isConnected } = useAccount()
  const [role, setRole] = useState<"idle"|"none"|"reader"|"writer">("idle")

  useEffect(() => {
    (async () => {
      if (!isConnected || !address || !NFT_CONTRACT) {
        setRole("idle")
        return
      }
      try {
        const res = await fetch(`/api/check-holder?user=${address}`, { cache: "no-store" })
        const json = await res.json()
        setRole(json.role ?? "none")
      } catch {
        setRole("none")
      }
    })()
  }, [isConnected, address])

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

  if (role === "idle") {
    return <div style={{ textAlign: "center", marginTop: 96 }}>Перевіряємо доступ…</div>
  }

  if (role === "none") {
    return (
      <div style={{ textAlign: "center", marginTop: 96 }}>
        <h2>Потрібний NFT не знайдено</h2>
        <ConnectButton />
      </div>
    )
  }

  // Є доступ
  const readOnly = role === "reader"

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* якщо у твоїй версії є проп readOnly/canEdit — використовуємо */}
      {/* <Tldraw readOnly={readOnly} />  або <Tldraw canEdit={!readOnly} /> */}
      <Tldraw persistenceKey="gated-room" />
      {readOnly && (
        <div style={{position:"fixed", top:12, right:12, padding:"6px 10px", background:"#ffeded", border:"1px solid #f66", borderRadius:6, fontWeight:600}}>
          Reader mode: редагування вимкнено
        </div>
      )}
    </div>
  )
}
