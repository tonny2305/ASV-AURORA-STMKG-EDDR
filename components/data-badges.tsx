"use client"

import type React from "react"
import { useTelemetry } from "./telemetry-provider"
import { Satellite, Timer, ShieldAlert } from "lucide-react"

export function DataBadges() {
  const { feed } = useTelemetry()
  const latest = feed?.latest

  const gps = (latest?.gps_status ?? "unknown").toString()
  const uptime = latest?.uptime_s
  const quality = gps === "valid" || gps === "fix" ? "Good" : gps === "invalid" ? "Poor" : "Unknown"

  return (
    <div className="flex h-full min-h-0 flex-col p-3">
      <div className="mb-2 text-sm font-medium">Status</div>
      <div className="grid min-h-0 flex-1 grid-rows-3 gap-3">
        <BadgeLine
          icon={<Satellite className="h-4 w-4" />}
          label="GPS"
          value={gps}
          variant={gps === "invalid" ? "warn" : "ok"}
        />
        <BadgeLine
          icon={<Timer className="h-4 w-4" />}
          label="Uptime"
          value={typeof uptime === "number" ? formatSeconds(uptime) : "—"}
          variant="neutral"
        />
        <BadgeLine
          icon={<ShieldAlert className="h-4 w-4" />}
          label="Data Quality"
          value={quality}
          variant={quality === "Good" ? "ok" : quality === "Poor" ? "warn" : "neutral"}
        />
      </div>
    </div>
  )
}

function BadgeLine({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode
  label: string
  value: string
  variant: "ok" | "warn" | "neutral"
}) {
  const color =
    variant === "ok"
      ? "dark:text-emerald-300 dark:border-emerald-500/40 dark:shadow-[0_0_16px_hsl(160_80%_55%_/_0.15)]"
      : variant === "warn"
        ? "dark:text-amber-300 dark:border-amber-500/40 dark:shadow-[0_0_16px_hsl(40_90%_60%_/_0.15)]"
        : "dark:text-muted-foreground dark:border-foreground/20"
  return (
    <div
      className={`min-w-0 flex items-center justify-between rounded-lg border border-black dark:border-foreground/20 bg-white dark:bg-background/50 px-3 py-2 ${color}`}
    >
      <div className="flex min-w-0 items-center gap-2 text-xs">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="shrink-0 text-xs tabular-nums">{value}</div>
    </div>
  )
}

function formatSeconds(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  if (h > 0) return `${h}h ${m}m ${sec}s`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}
