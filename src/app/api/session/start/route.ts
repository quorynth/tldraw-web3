import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("gate", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  })
  return res
}
