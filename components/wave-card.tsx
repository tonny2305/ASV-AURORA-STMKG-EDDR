"use client"

import styles from "@/styles/animations.module.css"
import { Waves } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { clamp } from "@/lib/math"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function WaveCard() {
  const { feed } = useTelemetry()
  const latest = feed?.latest

  const height = clamp(latest?.sensors?.wave_height ?? 0, 0, 5)
  const period = clamp(latest?.sensors?.wave_period ?? 0, 0, 60)
  const freq = clamp(latest?.sensors?.wave_frequency ?? 0, 0, 5)

  const animDuration = Math.max(1, Math.min(8, period || (freq ? 1 / freq : 4)))

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
        <Metric label="Height (m)" value={height} precision={2} />
        <Metric label="Period (s)" value={period} precision={2} />
        <Metric label="Frequency (Hz)" value={freq} precision={2} />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mt-4 h-14 overflow-hidden rounded-xl border border-[var(--accent-teal)]/20 bg-black/40 backdrop-blur-md group cursor-pointer">
            <div
              className={`${styles.wave} h-full transition-opacity group-hover:opacity-80`}
              style={{
                ["--wave-speed" as any]: `${animDuration}s`,
                ["--wave-color" as any]: "hsl(170 80% 55% / 0.3)",
                ["--wave-height" as any]: `${Math.min(12, height * 12)}px`,
              }}
              aria-label="Wave animation"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-black/80 backdrop-blur-md border border-[var(--accent-teal)]/20">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Height:</span>
              <span className="font-mono font-medium text-[var(--accent-teal)]">{height.toFixed(2)} m</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Period:</span>
              <span className="font-mono font-medium text-[var(--accent-teal)]">{period.toFixed(2)} s</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Frequency:</span>
              <span className="font-mono font-medium text-[var(--accent-teal)]">{freq.toFixed(2)} Hz</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
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
