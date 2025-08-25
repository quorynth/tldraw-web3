// src/middleware.ts
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Edge Runtime: без node:crypto
function makeNonce(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  // просте base64 (ASCII)
  // @ts-ignore
  return btoa(String.fromCharCode(...arr))
}

export function middleware(req: NextRequest) {
  // 1) Не застосовуємо CSP до API — щоб не блокувати дебаг
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const nonce = makeNonce()

  // Бери тільки ASCII-домени/схеми в один рядок
  const rpc = (process.env.NEXT_PUBLIC_RPC_URL ?? "").trim()

  const directives = [
    `default-src 'self'`,
    // якщо є інлайн-скрипти — даємо nonce
    `script-src 'self' 'nonce-${nonce}'`,
    // якщо інлайн-стилі: або 'unsafe-inline', або nonce-хеші (спрощено залишимо inline)
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://cdn.tldraw.com`,
    `font-src 'self' data: https://cdn.tldraw.com`,
    `connect-src 'self' ${rpc} https://*.alchemy.com https://cdn.tldraw.com https://tldraw-web3.vercel.app`,
    // якщо додаватимеш Liveblocks — розкоментуй:
    // `connect-src 'self' ${rpc} https://*.alchemy.com https://cdn.tldraw.com https://tldraw-web3.vercel.app wss://*.liveblocks.io`,
    `frame-ancestors 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
  ].filter(Boolean)

  // один ASCII-рядок без переносів
  let csp = directives.join("; ")
  // приберемо ВСЕ не-ASCII (підстраховка)
  csp = csp.replace(/[^\x20-\x7E]/g, "")

  res.headers.set("Content-Security-Policy", csp)
  res.headers.set("x-nonce", nonce) // опційно для дебагу

  return res
}

// Застосовуємо до всього, крім _next, api, favicon
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}
