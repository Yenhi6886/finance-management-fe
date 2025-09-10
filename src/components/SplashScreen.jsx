import React, { useEffect, useState } from 'react'

const SplashScreen = ({ onDone, minDurationMs = 800 }) => {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let rafId
    const startTs = performance.now()

    const tick = () => {
      const elapsed = performance.now() - startTs
      // Simulate smooth progress; cap at 99% until onDone is called
      const target = Math.min(99, Math.floor(20 + (elapsed / 8)))
      setProgress(p => Math.max(p, target))
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    const handleDone = async () => {
      const startTime = performance.now()
      const waitRemaining = Math.max(0, minDurationMs - (performance.now() - startTime))
      await new Promise(r => setTimeout(r, waitRemaining))
      setProgress(100)
      // small delay for finishing animation
      setTimeout(() => setVisible(false), 250)
      setTimeout(() => onDone && onDone(), 400)
    }
    // expose imperative finish via event for flexibility if needed later
    window.__finishSplash = handleDone
    return () => { delete window.__finishSplash }
  }, [minDurationMs, onDone])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#168A41',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{ color: '#ffffff', fontWeight: 800, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <span style={{ color: '#ffeb99', fontSize: 28 }}>★</span>
        <span style={{ fontSize: 30, color: '#ffffff' }}>FINANCE MANAGEMENT</span>
      </div>
      <div style={{ width: 520, height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#ffffff', transition: 'width 120ms linear' }} />
      </div>
      <div style={{ color: '#ffffff', marginTop: 12, fontSize: 20 }}>{progress}%</div>
    </div>
  )
}

export default SplashScreen


