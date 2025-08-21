"use client"
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"

export default function Board() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Tldraw persistenceKey="gated-room" />
    </div>
  )
}
