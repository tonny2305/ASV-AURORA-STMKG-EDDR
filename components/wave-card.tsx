// ...file should start with imports, not a stray bracket
"use client"
import React, { useState, useEffect } from "react"
function WaveSVG(props: { height: number; period: number; color: string }) {
  const { height, period, color } = props;
  const width = 400;
  const svgHeight = 56;
  const amplitude = Math.max(6, Math.min(svgHeight / 2 - 2, height * 12));
  const wavelength = Math.max(60, period * 40);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => p + 0.08), 40);
    return () => clearInterval(id);
  }, []);
  let d = `M 0 ${svgHeight / 2}`;
  for (let x = 0; x <= width; x += 4) {
    const y = svgHeight / 2 + amplitude * Math.sin((2 * Math.PI * (x + phase * wavelength)) / wavelength);
    d += ` L ${x} ${y.toFixed(2)}`;
  }
  return (
    <svg width="100%" height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`} style={{ display: "block" }}>
      <path d={d} stroke={color} strokeWidth={3} fill="none" />
    </svg>
  );
}

import styles from "@/styles/animations.module.css"
import { Waves } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { clamp } from "@/lib/math"

export function WaveCard() {
  const { feed } = useTelemetry()
  const latest = feed?.latest

  // Target values from telemetry
  const targetHeight = clamp(latest?.sensors?.wave_height ?? 0, 0, 5)
  const targetPeriod = clamp(latest?.sensors?.wave_period ?? 0, 0, 60)
  const targetFreq = clamp(latest?.sensors?.wave_frequency ?? 0, 0, 5)

  // Animated local state for smooth transitions
  const [animHeight, setAnimHeight] = useState<number>(targetHeight)
  const [animPeriod, setAnimPeriod] = useState<number>(targetPeriod)

  // Use refs to always have the latest target values inside the interval
  const targetHeightRef = React.useRef(targetHeight)
  const targetPeriodRef = React.useRef(targetPeriod)

  useEffect(() => {
    targetHeightRef.current = targetHeight
  }, [targetHeight])
  useEffect(() => {
    targetPeriodRef.current = targetPeriod
  }, [targetPeriod])

  // Start interval only once, always interpolate towards latest target values
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimHeight((prev: number) => {
        const diff = targetHeightRef.current - prev
        if (Math.abs(diff) < 0.01) return targetHeightRef.current
        return prev + diff * 0.2
      })
      setAnimPeriod((prev: number) => {
        const diff = targetPeriodRef.current - prev
        if (Math.abs(diff) < 0.05) return targetPeriodRef.current
        return prev + diff * 0.2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const animFreq = animPeriod > 0 ? 1 / animPeriod : 0
  const animDuration = Math.max(1, Math.min(8, animPeriod || (animFreq ? 1 / animFreq : 4)))

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm font-semibold">
          <Waves className="h-5 w-5 text-[var(--accent-teal)]" />
          <span className="text-white">
            Wave Metrics
          </span>
        </div>
        <div className="text-xs text-white/50 font-medium">real-time dynamics</div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
        <Metric label="Height (m)" value={animHeight} precision={2} />
        <Metric label="Period (s)" value={animPeriod} precision={2} />
        <Metric label="Frequency (Hz)" value={animFreq} precision={2} />
      </div>
      <div className="mt-4 h-14 overflow-hidden rounded-xl border border-[var(--accent-teal)]/20 bg-black/40 backdrop-blur-md flex items-center">
        <WaveSVG height={animHeight} period={animPeriod} color="hsl(170 80% 55% / 0.3)" />
      </div>

// Continuous sine wave SVG renderer
import React from "react"


function WaveSVG(props: { height: number; period: number; color: string }) {
  const { height, period, color } = props;
  const width = 400;
  const svgHeight = 56;
  const amplitude = Math.max(6, Math.min(svgHeight / 2 - 2, height * 12));
  const wavelength = Math.max(60, period * 40);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => p + 0.08), 40);
    return () => clearInterval(id);
  }, []);
  let d = `M 0 ${svgHeight / 2}`;
  for (let x = 0; x <= width; x += 4) {
    const y = svgHeight / 2 + amplitude * Math.sin((2 * Math.PI * (x + phase * wavelength)) / wavelength);
    d += ` L ${x} ${y.toFixed(2)}`;
  }
  return (
    <svg width="100%" height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`} style={{ display: "block" }}>
      <path d={d} stroke={color} strokeWidth={3} fill="none" />
    </svg>
  );
}
    </div>
  )
}

function Metric({ label, value, precision = 2 }: { label: string; value: number; precision?: number }) {
  return (
    <div className="group relative min-w-0 rounded-xl border border-[var(--accent-teal)]/20 bg-black/40 backdrop-blur-md p-3 transition-all hover:border-[var(--accent-teal)]/50 hover:bg-black/50">
      <div className="text-xs text-white/70 font-medium truncate transition-colors group-hover:text-[var(--accent-teal)]">{label}</div>
      <div className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-white">{value.toFixed(precision)}</div>
    </div>
  )
}
