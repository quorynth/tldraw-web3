import { NextResponse } from "next/server"
import { SiweMessage } from "siwe"
import { z } from "zod"

const Body = z.object({ message: z.string(), signature: z.string() })

export async function POST(req: Request) {
  const { message, signature } = Body.parse(await req.json())
  const msg = new SiweMessage(message)
  try {
    const fields = await msg.verify({ signature, domain: process.env.SIWE_DOMAIN })
    return NextResponse.json({ ok: fields.success, address: msg.address })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 200 })
  }
}
