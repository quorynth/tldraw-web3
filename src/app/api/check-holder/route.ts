import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { mainnet, polygon } from "viem/chains"
import erc721 from "@/lib/abi/erc721.json"
import erc1155 from "@/lib/abi/erc1155.json"

function pickChain() {
  const id = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  if (id === 137) return polygon
  if (id === 1) return mainnet
  // дефолт: polygon, щоб відповідало твоєму сетапу
  return polygon
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const nft = searchParams.get("nft") as `0x${string}` | null
  const user = searchParams.get("user") as `0x${string}` | null

  // тип + tokenId беремо з query або з ENV
  const type =
    (searchParams.get("type") ||
      process.env.NEXT_PUBLIC_NFT_TYPE ||
      "erc721").toLowerCase()

  const tokenIdStr =
    searchParams.get("tokenId") ||
    process.env.NEXT_PUBLIC_NFT_TOKEN_ID ||
    "0"
  let tokenId: bigint
  try {
    tokenId = BigInt(tokenIdStr)
  } catch {
    return NextResponse.json({ error: "Bad tokenId" }, { status: 400 })
  }

  if (!nft || !user) {
    return NextResponse.json({ error: "Missing nft or user" }, { status: 400 })
  }

  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
  if (!rpcUrl) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_RPC_URL" },
      { status: 500 }
    )
  }

  const client = createPublicClient({
    chain: pickChain(),
    transport: http(rpcUrl),
  })

  try {
    let held = false

    if (type === "erc1155") {
      const balance = (await client.readContract({
        address: nft,
        abi: erc1155,
        functionName: "balanceOf",
        args: [user, tokenId],
      })) as unknown as bigint
      held = balance > 0n
    } else {
      const balance = (await client.readContract({
        address: nft,
        abi: erc721,
        functionName: "balanceOf",
        args: [user],
      })) as unknown as bigint
      held = balance > 0n
    }

    return NextResponse.json({ held })
  } catch (err: any) {
    const msg = err?.shortMessage || err?.message || "Contract read failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
