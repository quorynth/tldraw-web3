// src/app/layout.tsx
import "./globals.css"
import { Providers } from "../providers"
import { headers } from "next/headers"

export const metadata = {
  title: "TLDraw NFT Gate",
  description: "Protected TLDraw",
}

// ⚠ RootLayout тепер має бути async
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()       // треба await
  const nonce = h.get("x-nonce") || undefined

  return (
    <html lang="uk">
      <body>
        <Providers>{children}</Providers>
        <script nonce={nonce} />
      </body>
    </html>
  )
}
