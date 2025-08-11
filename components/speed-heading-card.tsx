"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Gauge, Compass } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { clamp } from "@/lib/math"

export function SpeedHeadingCard() {
  const { feed } = useTelemetry()
  const latest = feed?.latest
  const reduce = useReducedMotion()

  const speed = latest?.sensors?.speed_kn
  const hasSpeed = typeof speed === "number" && !Number.isNaN(speed)
  const speedClamped = clamp(speed ?? 0, 0, 60)

  const heading = clamp(latest?.sensors?.heading_deg ?? 0, 0, 359)

  return (
    <div className="flex h-full min-h-0 flex-col p-3">
      <div className="mb-2 grid grid-cols-2 gap-2">
        <div className="min-w-0 rounded-lg border border-black dark:border-foreground/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-black dark:text-muted-foreground min-w-0">
            <Gauge className="h-4 w-4" />
            <span className="truncate">Speed (kn)</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="text-2xl font-semibold tabular-nums">{hasSpeed ? speedClamped.toFixed(1) : "N/A"}</div>
            <div className="relative h-8 w-8 shrink-0">
              <motion.div
                className="absolute inset-0 rounded-full border border-black/30 dark:border-foreground/20"
                animate={reduce || !hasSpeed ? { rotate: 0 } : { rotate: speedClamped * 6 }}
                transition={{ type: "spring", stiffness: 60, damping: 16 }}
                aria-label="Indikator speed"
              />
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-lg border border-black dark:border-foreground/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-black dark:text-muted-foreground min-w-0">
            <Compass className="h-4 w-4" />
            <span className="truncate">Heading (°)</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="text-2xl font-semibold tabular-nums">{heading.toFixed(0)}</div>
            <div className="relative h-8 w-8 shrink-0">
              <motion.div
                className="absolute left-1/2 top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-[calc(50%+6px)] rounded-full bg-[var(--accent-cyan)]"
                style={{ transformOrigin: "center 16px" }}
                animate={reduce ? { rotate: 0 } : { rotate: heading }}
                transition={{ type: "spring", stiffness: 60, damping: 16 }}
                aria-label="Kompas digital"
              />
              <div className="absolute inset-0 rounded-full border border-black/30 dark:border-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
