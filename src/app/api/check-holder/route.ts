import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { mainnet, polygon } from "viem/chains"
import erc721 from "@/lib/abi/erc721.json"

function pickChain() {
  const id = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  if (id === 137) return polygon
  if (id === 1) return mainnet
  return polygon
}

function parseIds(name: "WRITER_TOKEN_IDS" | "READER_TOKEN_IDS"): bigint[] {
  const raw = process.env[name]
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as (number | string)[]
    return arr.map(v => BigInt(v as any))
  } catch {
    // дозволимо простий формат типу "1,2,3"
    return raw.split(",").map(s => BigInt(s.trim()))
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user = searchParams.get("user")?.toLowerCase()
    const nft = (process.env.NEXT_PUBLIC_NFT_CONTRACT || "").toLowerCase()
    if (!user || !nft) {
      return NextResponse.json({ error: "user or contract missing" }, { status: 400 })
    }

    const chain = pickChain()
    const rpc = process.env.NEXT_PUBLIC_RPC_URL
    const client = createPublicClient({ chain, transport: http(rpc) })

    const writerIds = parseIds("WRITER_TOKEN_IDS")
    const readerIds = parseIds("READER_TOKEN_IDS")

    // допоміжна: перевірити власника конкретного tokenId
    async function isOwnerOf(tokenId: bigint): Promise<boolean> {
      try {
        const owner = await client.readContract({
          address: nft as `0x${string}`,
          abi: erc721,
          functionName: "ownerOf",
          args: [tokenId],
        }) as string
        return owner.toLowerCase() === user
      } catch {
        return false
      }
    }

    // 1) пріоритет — writer
    for (const id of writerIds) {
      if (await isOwnerOf(id)) {
        return NextResponse.json({ role: "writer" })
      }
    }

    // 2) потім — reader
    for (const id of readerIds) {
      if (await isOwnerOf(id)) {
        return NextResponse.json({ role: "reader" })
      }
    }

    // 3) інакше — none
    return NextResponse.json({ role: "none" })
  } catch (err: any) {
    const msg = err?.shortMessage || err?.message || "role check failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
