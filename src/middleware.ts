// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Edge Runtime: використовуємо Web Crypto, без 'node:crypto'
function makeNonce(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  // base64 (досить для CSP nonce)
  // @ts-ignore btoa доступний у Edge runtime
  return btoa(String.fromCharCode(...arr))
}

export function middleware(req: NextRequest) {
  const nonce = makeNonce()

  // Прокидуємо nonce у заголовки запиту, щоб зчитати його в layout.tsx через next/headers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-nonce", nonce)

  const res = NextResponse.next({ request: { headers: requestHeaders } })

  // CSP (мінімально потрібне для TLDraw + твій стек)
  const csp = `
    default-src 'self';
    base-uri 'self';
    frame-ancestors 'self';
    object-src 'none';

    script-src 'self' 'nonce-${nonce}';
    script-src-elem 'self' 'nonce-${nonce}';
    script-src-attr 'self' 'nonce-${nonce}';

    style-src 'self' 'nonce-<...>' 'unsafe-inline' 'unsafe-hashes';
    style-src-elem 'self' 'nonce-<...>' 'unsafe-inline';
    style-src-attr 'self' 'nonce-<...>' 'unsafe-inline';

    img-src 'self' data: blob: https://cdn.tldraw.com https://*.tldraw.com;
    font-src 'self' https://cdn.tldraw.com data:;

    connect-src 'self' blob: https://cdn.tldraw.com https://polygon-mainnet.g.alchemy.com https://*.walletconnect.com https://*.reown.com;

    worker-src 'self' blob:;
    frame-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
    child-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
    manifest-src 'self' https://cdn.tldraw.com;
  `.replace(/\s{2,}/g, " ").trim()

  res.headers.set("Content-Security-Policy", csp)
  // дублюємо nonce у відповідь (не обов'язково, але зручно дебажити)
  res.headers.set("x-nonce", nonce)

  return res
}

// за замовчуванням на всі шляхи
export const config = { matcher: "/:path*" }
