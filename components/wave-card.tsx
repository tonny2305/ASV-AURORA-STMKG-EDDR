"use client"

import styles from "@/styles/animations.module.css"
import { Waves } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { clamp } from "@/lib/math"

export function WaveCard() {
  const { feed } = useTelemetry()
  const latest = feed?.latest

  const height = clamp(latest?.sensors?.wave_height ?? 0, 0, 5)
  const period = clamp(latest?.sensors?.wave_period ?? 0, 0, 60)
  const freq = clamp(latest?.sensors?.wave_frequency ?? 0, 0, 5)

  const animDuration = Math.max(1, Math.min(8, period || (freq ? 1 / freq : 4)))

  return (
    <div className="flex h-full min-h-0 flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Waves className="h-4 w-4 text-[var(--accent-teal)]" />
          Waves
        </div>
        <div className="text-xs text-black dark:text-muted-foreground">period-driven animation</div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-3">
        <Metric label="Height (m)" value={height} precision={2} />
        <Metric label="Period (s)" value={period} precision={2} />
        <Metric label="Frequency (Hz)" value={freq} precision={2} />
      </div>
      <div className="mt-3 h-12 overflow-hidden rounded-lg border border-black dark:border-foreground/20 bg-white dark:bg-background/50">
        <div
          className={`${styles.wave} h-full`}
          style={{
            ["--wave-speed" as any]: `${animDuration}s`,
            ["--wave-color" as any]: "hsl(170 80% 55% / 0.5)",
            ["--wave-height" as any]: `${Math.min(10, height * 10)}px`,
          }}
          aria-label="Animasi gelombang"
        />
      </div>
    </div>
  )
}

function Metric({ label, value, precision = 2 }: { label: string; value: number; precision?: number }) {
  return (
    <div className="min-w-0 rounded-lg border border-black dark:border-foreground/20 p-3">
      <div className="text-xs text-black dark:text-muted-foreground truncate">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value.toFixed(precision)}</div>
    </div>
  )
}
