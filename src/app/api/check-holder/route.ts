import { NextResponse } from "next/server"
import { createPublicClient, http, getAddress } from "viem"
import { base } from "viem/chains"
import erc721 from "../../../lib/abi/erc721.json"
import erc1155 from "../../../lib/abi/erc1155.json"

const client = createPublicClient({
  chain: base,
  transport: http(process.env.RPC_URL)
})

export async function POST(req: Request) {
  const { address } = await req.json() as { address: string }
  const user = getAddress(address)
  const nft = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`
  const type = process.env.NEXT_PUBLIC_NFT_TYPE
  const tokenId = BigInt(process.env.NEXT_PUBLIC_NFT_TOKEN_ID ?? "0")

  let held = false
  try {
    if (type === "erc1155") {
      const balance: bigint = await client.readContract({
        address: nft, abi: erc1155, functionName: "balanceOf", args: [user, tokenId]
      })
      held = balance > 0n
    } else {
      const balance: bigint = await client.readContract({
        address: nft, abi: erc721, functionName: "balanceOf", args: [user]
      })
      held = balance > 0n
    }
  } catch (e) {
    return NextResponse.json({ held: false, error: String(e) }, { status: 200 })
  }
  return NextResponse.json({ held })
}
