"use client"

import "tldraw/tldraw.css"
import { Tldraw } from "tldraw"

export default function BoardPage() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  )
}
