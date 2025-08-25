// src/middleware.ts
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Edge-safe nonce
function makeNonce() {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  // @ts-ignore
  return btoa(String.fromCharCode(...arr))
}

export function middleware(req: NextRequest) {
  // Дозволяємо API без CSP, щоб легко дебажити
  if (req.nextUrl.pathname.startsWith("/api")) return NextResponse.next()

  const res = NextResponse.next()
  const nonce = makeNonce()
  const rpc = (process.env.NEXT_PUBLIC_RPC_URL ?? "").trim()

  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://cdn.tldraw.com`,
    `font-src 'self' data: https://cdn.tldraw.com`,
    `connect-src 'self' ${rpc} https://*.alchemy.com https://cdn.tldraw.com https://tldraw-web3.vercel.app https://*.walletconnect.com https://*.reown.com`,
    // якщо додаси Liveblocks: `wss://*.liveblocks.io`
    `worker-src 'self' blob:`,
    `frame-src 'self' https://verify.walletconnect.com https://*.walletconnect.com`,
    `frame-ancestors 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
  ].filter(Boolean)

  let csp = directives.join("; ")
  csp = csp.replace(/[^\x20-\x7E]/g, "") // прибираємо не-ASCII на всяк випадок

  res.headers.set("Content-Security-Policy", csp)
  res.headers.set("x-nonce", nonce) // лише для дебагу
  return res
}

export const config = { matcher: ["/((?!_next|api|favicon.ico).*)"] }
