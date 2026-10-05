import { useEffect, useRef } from 'react'

const wave = p => {
  const g = (m, w, a) => a * Math.exp(-(((p - m) / w) ** 2))
  return g(0.18, 0.04, 0.12) + g(0.36, 0.012, -0.15) + g(0.4, 0.014, 1) + g(0.44, 0.014, -0.25) + g(0.68, 0.06, 0.3)
}

export default function EcgChart({ hr, color }) {
  const canvasRef = useRef(null)
  const hrRef = useRef(hr)
  const colorRef = useRef(color)
  hrRef.current = hr
  colorRef.current = color

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const buf = []
    let phase = 0
    let last = performance.now()
    let raf

    const loop = now => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const d = window.devicePixelRatio || 1
      const w = cv.clientWidth
      const h = 150
      if (cv.width !== Math.round(w * d)) {
        cv.width = Math.round(w * d)
        cv.height = h * d
      }
      phase = (phase + (hrRef.current / 60) * dt) % 1
      buf.push(wave(phase) + (Math.random() - 0.5) * 0.02)
      while (buf.length > Math.floor(w / 2)) buf.shift()

      ctx.setTransform(d, 0, 0, d, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = colorRef.current
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.beginPath()
      buf.forEach((v, i) => {
        const X = i * 2
        const Y = h * 0.62 - v * h * 0.5
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y)
      })
      ctx.stroke()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="ecg" />
}