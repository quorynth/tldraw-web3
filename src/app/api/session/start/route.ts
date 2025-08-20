import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const c = cookies()
  c.set("gate", "ok", { httpOnly: true, sameSite: "lax", secure: true, path: "/" })
  return NextResponse.json({ ok: true })
}
