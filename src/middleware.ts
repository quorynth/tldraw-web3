// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"

export function middleware(req: NextRequest) {
  const nonce = crypto.randomBytes(16).toString("base64")

  const csp = `
    default-src 'self';
    base-uri 'self';
    frame-ancestors 'self';
    object-src 'none';
    script-src 'self' 'nonce-${nonce}';
    script-src-elem 'self' 'nonce-${nonce}';
    script-src-attr 'self' 'nonce-${nonce}';
    style-src 'self' 'nonce-${nonce}' 'unsafe-hashes';
    style-src-elem 'self' 'nonce-${nonce}';
    style-src-attr 'self' 'nonce-${nonce}';
    img-src 'self' data: blob: https://cdn.tldraw.com https://*.tldraw.com;
    font-src 'self' https://cdn.tldraw.com data:;
    connect-src 'self' blob: https://cdn.tldraw.com https://polygon-mainnet.g.alchemy.com https://*.walletconnect.com https://*.reown.com;
    worker-src 'self' blob:;
    frame-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
    child-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
    manifest-src 'self' https://cdn.tldraw.com;
  `.replace(/\s{2,}/g, " ").trim()

  const res = NextResponse.next()
  res.headers.set("Content-Security-Policy", csp)
  res.headers.set("x-nonce", nonce)
  return res
}
