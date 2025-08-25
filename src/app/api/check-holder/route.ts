// src/app/api/check-holder/route.ts
export const runtime = "nodejs"  // щоб не їхав Edge Runtime

import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { mainnet, polygon, base, arbitrum, optimism } from "viem/chains"

// Мінімальний ABI для ERC-721
const erc721Abi = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const

function chainById(id: number) {
  return (
    {
      1: mainnet,
      137: polygon,
      8453: base,
      42161: arbitrum,
      10: optimism,
    } as const
  )[id] ?? polygon
}

function parseIds(envName: "WRITER_TOKEN_IDS" | "READER_TOKEN_IDS"): bigint[] {
  const raw = process.env[envName]
  if (!raw) return []
  try {
    // JSON формат: [1,2,3]
    return (JSON.parse(raw) as (number | string)[]).map((v) => BigInt(v as any))
  } catch {
    // Резерв: "1,2,3"
    return raw.split(",").map((s) => BigInt(s.trim()))
  }
}

// Нормалізуємо 0x-адресу до нижнього регістру
const norm = (s: string) => s.trim().toLowerCase()

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const user = url.searchParams.get("user")
    if (!user) {
      return NextResponse.json({ error: "user missing" }, { status: 400 })
    }

    const contract = process.env.NEXT_PUBLIC_NFT_CONTRACT
    if (!contract) {
      return NextResponse.json({ error: "contract missing" }, { status: 500 })
    }

    // ВАЖЛИВО: на сервері краще юзати приватний RPC
    const rpc =
      process.env.ALCHEMY_HTTP_URL ||
      process.env.NEXT_PUBLIC_RPC_URL // запасний варіант
    if (!rpc) {
      return NextResponse.json({ error: "rpc missing" }, { status: 500 })
    }

    const chainId = Number(process.env.CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID || 137)
    const client = createPublicClient({
      chain: chainById(chainId),
      transport: http(rpc),
    })

    const writerIds = parseIds("WRITER_TOKEN_IDS")
    const readerIds = parseIds("READER_TOKEN_IDS")

    const userLc = norm(user)
    const contractLc = norm(contract)

    const isOwnerOf = async (tokenId: bigint) => {
      try {
        const owner = (await client.readContract({
          address: contractLc as `0x${string}`,
          abi: erc721Abi,
          functionName: "ownerOf",
          args: [tokenId],
        })) as string
        return { ok: norm(owner) === userLc, owner }
      } catch (e: any) {
        return { ok: false, error: e?.shortMessage || e?.message || "readContract failed" }
      }
    }

    // 1) writer має пріоритет
    for (const id of writerIds) {
      const r = await isOwnerOf(id)
      if (r.ok) {
        if (url.searchParams.get("debug") === "1") {
          return NextResponse.json({
            role: "writer",
            chainId,
            contract: contractLc,
            rpc: !!rpc,
            writerIds: writerIds.map(String),
            readerIds: readerIds.map(String),
            checks: [{ tokenId: id.toString(), owner: r.owner, matches: true }],
          })
        }
        return NextResponse.json({ role: "writer" })
      }
    }

    // 2) reader
    for (const id of readerIds) {
      const r = await isOwnerOf(id)
      if (r.ok) {
        if (url.searchParams.get("debug") === "1") {
          return NextResponse.json({
            role: "reader",
            chainId,
            contract: contractLc,
            rpc: !!rpc,
            writerIds: writerIds.map(String),
            readerIds: readerIds.map(String),
            checks: [{ tokenId: id.toString(), owner: r.owner, matches: true }],
          })
        }
        return NextResponse.json({ role: "reader" })
      }
    }

    // 3) немає доступу
    if (url.searchParams.get("debug") === "1") {
      // з дебагом покажемо спроби перевірок
      const writerChecks = await Promise.all(
        writerIds.map(async (id) => {
          const r = await isOwnerOf(id)
          return { tokenId: id.toString(), ...(r.owner ? { owner: r.owner } : {}), ...(r.error ? { error: r.error } : {}) }
        })
      )
      const readerChecks = await Promise.all(
        readerIds.map(async (id) => {
          const r = await isOwnerOf(id)
          return { tokenId: id.toString(), ...(r.owner ? { owner: r.owner } : {}), ...(r.error ? { error: r.error } : {}) }
        })
      )
      return NextResponse.json({
        role: "none",
        chainId,
        contract: contractLc,
        rpc: !!rpc,
        writerIds: writerIds.map(String),
        readerIds: readerIds.map(String),
        checks: [...writerChecks, ...readerChecks],
      })
    }

    return NextResponse.json({ role: "none" })
  } catch (err: any) {
    const msg = err?.shortMessage || err?.message || "role check failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
