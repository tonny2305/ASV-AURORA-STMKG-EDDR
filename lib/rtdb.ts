import type { TelemetryFeed, TelemetryNode } from "@/types/asv"
import { parseTimestamp } from "./parse"
import { clamp } from "./math"

// Normalize RTDB snapshot value (object keyed by push IDs) into a feed.
export function normalizeFeed(raw: Record<string, any>): TelemetryFeed {
  const nodes: TelemetryNode[] = Object.entries(raw)
    .map(([key, data]) => {
      const ts = typeof data?.timestamp === "string" ? parseTimestamp(data.timestamp) : null
      const sensors = data?.sensors ?? {}
      // clamp key fields for safety
      const heading = clamp(sensors?.heading_deg ?? null, 0, 359)
      const wave_height = Math.max(0, sensors?.wave_height ?? 0)
      const wave_period = Math.max(0, sensors?.wave_period ?? 0)
      const wave_frequency = Math.max(0, sensors?.wave_frequency ?? 0)
      const pressure_hpa = sensors?.pressure_hpa ?? null
      const temp_c = sensors?.temp_c ?? null
      const alt_m = sensors?.alt_m ?? null
      const lat = sensors?.lat ?? null
      const lon = sensors?.lon ?? null
      const speed_kn = sensors?.speed_kn ?? null

      return {
        key,
        timestamp: ts ?? new Date(0),
        data: {
          gps_status: data?.gps_status ?? "unknown",
          uptime_s: data?.uptime_s ?? null,
          sensors: {
            heading_deg: heading ?? null,
            wave_height,
            wave_period,
            wave_frequency,
            pressure_hpa,
            temp_c,
            alt_m,
            lat,
            lon,
            speed_kn,
          },
          timestamp: data?.timestamp ?? "",
        },
      } as TelemetryNode
    })
    .filter((n) => n.timestamp instanceof Date)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  const latest = nodes[nodes.length - 1]?.data ?? null

  return {
    ordered: nodes,
    latest,
  }
}
