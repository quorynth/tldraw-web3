import { NextRequest, NextResponse } from "next/server"

const PROTECTED = ["/board"]

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const needsAuth = PROTECTED.some(p => path.startsWith(p))
  if (!needsAuth) return NextResponse.next()

  const gate = req.cookies.get("gate")?.value
  if (gate === "ok") return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = "/gate"
  url.searchParams.set("next", path)
  return NextResponse.redirect(url)
}

export const config = { matcher: ["/((?!_next|favicon.ico|api).*)"] }
