"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import Image from "next/image"
import { Waves } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { clamp } from "@/lib/math"

function buildSinePath({
  width,
  height,
  amplitudePx,
  wavelengthPx,
  baselineY,
  step = 8,
}: {
  width: number
  height: number
  amplitudePx: number
  wavelengthPx: number
  baselineY: number
  step?: number
}) {
  const k = (2 * Math.PI) / wavelengthPx
  const pts: string[] = []
  for (let x = 0; x <= width; x += step) {
    const y = baselineY + amplitudePx * Math.sin(k * x)
    pts.push(`${x},${y}`)
  }
  const d = `M 0 ${height} L 0 ${baselineY} L ${pts.join(" ")} L ${width} ${height} Z`
  return d
}

export function ShipScene() {
  const { feed } = useTelemetry()
  const latest = feed?.latest

  const waveHeightM = clamp(latest?.sensors?.wave_height ?? 0, 0, 5)
  const wavePeriodSRaw = latest?.sensors?.wave_period ?? 0
  const wavePeriodS = wavePeriodSRaw > 0 ? clamp(wavePeriodSRaw, 0.5, 20) : 4

  const amplitudePx = Math.max(2, Math.min(36, waveHeightM * 24))

  const wrapRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 320, h: 160 })
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setDims({ w: Math.max(280, Math.floor(r.width)), h: Math.max(120, Math.floor(r.height)) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const wavelengthPx = Math.max(160, Math.floor(dims.w * 0.75))
  const baselineY = Math.floor(dims.h * 0.6)

  const tilePath = useMemo(() => {
    return buildSinePath({
      width: wavelengthPx,
      height: dims.h,
      amplitudePx,
      wavelengthPx,
      baselineY,
      step: 6,
    })
  }, [wavelengthPx, dims.h, amplitudePx, baselineY])

  const prefersReduced = useReducedMotion()
  const [shiftPx, setShiftPx] = useState(0)
  const [shipY, setShipY] = useState(baselineY)
  const shipXRatio = 0.35
  const shipX = Math.floor(dims.w * shipXRatio)

  useEffect(() => {
    if (prefersReduced) {
      setShiftPx(0)
      setShipY(baselineY)
      return
    }
    let raf = 0
    let last = performance.now()
    let localShift = 0
    const loop = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      const pxPerSec = wavelengthPx / (wavePeriodS || 4)
      localShift = (localShift + pxPerSec * dt) % wavelengthPx
      const phase = (localShift / wavelengthPx) * 2 * Math.PI
      const k = (2 * Math.PI) / wavelengthPx
      const y = baselineY + amplitudePx * Math.sin(phase + k * shipX)
      setShiftPx(localShift)
      setShipY(y)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [prefersReduced, wavelengthPx, wavePeriodS, baselineY, amplitudePx, shipX])

  return (
    <div ref={wrapRef} className="flex h-full min-h-0 flex-col p-3">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <div className="text-sm font-medium">Ship</div>
        <div className="flex items-center gap-1 text-xs text-black dark:text-muted-foreground">
          <Waves className="h-4 w-4" />
          {waveHeightM.toFixed(2)} m · {wavePeriodS.toFixed(2)} s
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-black dark:border-foreground/20 bg-white/40 dark:bg-background/40">
        <svg
          aria-hidden="true"
          width={dims.w}
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          className="absolute inset-0"
          style={{ filter: "drop-shadow(0 0 24px hsl(170 80% 55% / 0.2))" }}
        >
          <g
            transform={`translate(${-shiftPx}, 0)`}
            style={{ transition: "transform 50ms linear" }}
            fill="hsl(170 80% 55% / 0.18)"
            stroke="hsl(170 80% 55% / 0.9)"
            strokeWidth={2}
          >
            <path d={tilePath} />
            <g transform={`translate(${wavelengthPx},0)`}>
              <path d={tilePath} />
            </g>
            <g opacity={0.5}>
              <path d={tilePath} fill="hsl(185 85% 60% / 0.14)" stroke="hsl(185 85% 60% / 0.7)" />
              <g transform={`translate(${wavelengthPx},0)`}>
                <path d={tilePath} fill="hsl(185 85% 60% / 0.14)" stroke="hsl(185 85% 60% / 0.7)" />
              </g>
            </g>
          </g>
        </svg>

        <div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            background: "radial-gradient(120% 60% at 50% 100%, hsl(265 90% 70% / 0.12) 0%, transparent 60%)",
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            left: `${shipXRatio * 100}%`,
            top: Math.max(0, shipY - 40),
            willChange: "transform, top",
            transition: prefersReduced ? "top 150ms ease-out" : "top 50ms linear",
          }}
          aria-label="Animasi kapal mengikuti gelombang"
        >
          <Image
            src="/ship.png"
            alt="ASV (side view)"
            width={140}
            height={140}
            className="opacity-90"
            priority={false}
          />
        </div>
      </div>
    </div>
  )
}
