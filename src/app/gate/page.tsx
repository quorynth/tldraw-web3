"use client"
import { useEffect, useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Gate() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [status, setStatus] = useState<"idle"|"checking"|"ok"|"fail">("idle")
  const [msg, setMsg] = useState<string>("")

  useEffect(() => {
    (async () => {
      if (!isConnected || !address) return
      setStatus("checking"); setMsg("Перевіряємо підпис...")
      const { nonce } = await fetch("/api/siwe/nonce").then(r=>r.json())
      const message = [
        "TLDraw Gate",
        `Domain: ${window.location.host}`,
        `Address: ${address}`,
        `Nonce: ${nonce}`,
        `Issued At: ${new Date().toISOString()}`
      ].join("\n")
      try {
        const signature = await signMessageAsync({ message })
        const siwe = await fetch("/api/siwe/verify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, signature })
        }).then(r=>r.json())
        if (!siwe.ok) throw new Error("SIWE невдалий")

        setMsg("Перевіряємо NFT...")
        const holder = await fetch("/api/check-holder", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address })
        }).then(r=>r.json())
        if (!holder.held) throw new Error("Немає потрібного NFT")

        await fetch("/api/session/start", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address })
        })
        setStatus("ok"); setMsg("Готово! Переходимо...")
        const next = new URLSearchParams(location.search).get("next") ?? "/board"
        location.href = next
      } catch (e: any) {
        setStatus("fail"); setMsg(e?.message || "Помилка авторизації")
      }
    })()
  }, [isConnected, address, signMessageAsync])

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>NFT Gate</h1>
      <p>Підключи гаманець і підпиши запит, після чого перевіримо NFT.</p>
      <ConnectButton />
      <p style={{ marginTop: 16 }}>{msg || (status === "idle" ? "Готовий, підключай гаманець" : "")}</p>
    </main>
  )
}
