import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { mainnet, polygon } from "viem/chains"
import erc721 from "@/lib/abi/erc721.json"
import erc1155 from "@/lib/abi/erc1155.json"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const nft = searchParams.get("nft") as `0x${string}`
  const user = searchParams.get("user") as `0x${string}`
  const type = searchParams.get("type") || "erc721"
  const tokenId = searchParams.get("tokenId") ? BigInt(searchParams.get("tokenId")!) : 0n

  if (!nft || !user) {
    return NextResponse.json({ error: "Missing nft or user" }, { status: 400 })
  }

  // Ланцюг можна виставити через ENV (polygon або mainnet)
  const chain = process.env.NEXT_PUBLIC_CHAIN === "polygon" ? polygon : mainnet

  const client = createPublicClient({
    chain,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL || undefined),
  })

  try {
    let held = false

    if (type === "erc1155") {
      const balance = (await client.readContract({
        address: nft,
        abi: erc1155,
        functionName: "balanceOf",
        args: [user, tokenId],
      })) as bigint

      held = balance > 0n
    } else {
      const balance = (await client.readContract({
        address: nft,
        abi: erc721,
        functionName: "balanceOf",
        args: [user],
      })) as bigint

      held = balance > 0n
    }

    return NextResponse.json({ held })
  } catch (err) {
    console.error("NFT check failed", err)
    return NextResponse.json({ error: "Contract read failed" }, { status: 500 })
  }
}
