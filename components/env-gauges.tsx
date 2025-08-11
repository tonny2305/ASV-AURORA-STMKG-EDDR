"use client"

import type React from "react"
import { Thermometer, Mountain, CloudDrizzle } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { clamp } from "@/lib/math"

export function EnvGauges() {
  const { feed } = useTelemetry()
  const s = feed?.latest?.sensors

  const temp = clamp(s?.temp_c ?? 0, -20, 60)
  const pressure = clamp(s?.pressure_hpa ?? 0, 800, 1100)
  const alt = clamp(s?.alt_m ?? 0, -100, 5000)

  return (
    <div className="flex h-full min-h-0 flex-col p-3">
      <div className="mb-2 text-sm font-medium">Environment</div>
      <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-3">
        <Gauge
          icon={<Thermometer className="h-4 w-4 text-[var(--accent-purple)]" />}
          label="Temp (°C)"
          value={temp}
          min={-20}
          max={60}
          color="hsl(265 90% 70%)"
        />
        <Gauge
          icon={<CloudDrizzle className="h-4 w-4 text-[var(--accent-cyan)]" />}
          label="Pressure (hPa)"
          value={pressure}
          min={800}
          max={1100}
          color="hsl(185 85% 60%)"
        />
        <Gauge
          icon={<Mountain className="h-4 w-4 text-[var(--accent-teal)]" />}
          label="Altitude (m)"
          value={alt}
          min={-100}
          max={5000}
          color="hsl(170 80% 55%)"
        />
      </div>
    </div>
  )
}

function Gauge({
  icon,
  label,
  value,
  min,
  max,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  min: number
  max: number
  color: string
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  return (
    <div
      className="min-w-0 rounded-lg border border-black dark:border-foreground/20 p-3"
      role="group"
      aria-label={`${label} gauge`}
    >
      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-black dark:text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          {icon}
          <span className="truncate">{label}</span>
        </div>
        <span className="shrink-0 tabular-nums">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-black/10 dark:bg-foreground/10">
        <div
          className="h-2 rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 16px ${color}40` }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          role="progressbar"
        />
      </div>
    </div>
  )
}
