import "./globals.css"
import { Providers } from "../providers"


export const metadata = { title: "TLDraw NFT Gate", description: "Protected TLDraw" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
