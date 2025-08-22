// src/app/layout.tsx
import "./globals.css"
import { Providers } from "../providers"
import { headers } from "next/headers"

export const metadata = {
  title: "TLDraw NFT Gate",
  description: "Protected TLDraw",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // дістаємо nonce із заголовків, які проставляє middleware
  const nonce = headers().get("x-nonce") || undefined

  return (
    <html lang="uk">
      <body>
        <Providers>{children}</Providers>
        {/* пустий скрипт з nonce для ініціалізації, 
            щоб Next/TLDraw inline-скрипти теж пройшли CSP */}
        <script nonce={nonce} />
      </body>
    </html>
  )
}
