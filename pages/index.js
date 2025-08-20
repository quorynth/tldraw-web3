import '@tldraw/tldraw/tldraw.css'
import { Tldraw } from '@tldraw/tldraw'

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Tldraw persistenceKey="board-1" />
    </div>
  )
}
