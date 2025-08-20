import Link from "next/link"
export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>TLDraw Gate</h1>
      <p><Link href="/gate">Перейти до Gate</Link></p>
      <p><Link href="/board">Відкрити дошку</Link></p>
    </main>
  )
}
