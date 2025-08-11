import type { TelemetryFeed, TelemetryNode } from "@/types/asv"
import { parseTimestamp } from "./parse"
import { clamp } from "./math"

// Menyimpan posisi terakhir yang valid
let lastValidLat: number | null = null
let lastValidLon: number | null = null

// Normalize RTDB snapshot value (object keyed by push IDs) into a feed.
export function normalizeFeed(raw: Record<string, any>): TelemetryFeed {
  const nodes: TelemetryNode[] = Object.entries(raw)
    .map(([key, data]) => {
      const ts = (typeof data?.timestamp === "string" || typeof data?.timestamp === "number")
        ? parseTimestamp(String(data.timestamp))
        : null;
      const sensors = data?.sensors ?? {};
      const gps = data?.gps ?? {};
      // clamp key fields for safety
      const heading = clamp(sensors?.heading_deg ?? null, 0, 359);
      const wave_height = Math.max(0, sensors?.wave_height ?? 0);
      const wave_period = Math.max(0, sensors?.wave_period ?? 0);
      const wave_frequency = Math.max(0, sensors?.wave_frequency ?? 0);
      const pressure_hpa = sensors?.pressure_hpa ?? null;
      const temp_c = sensors?.temp_c ?? null;
      const alt_m = sensors?.alt_m ?? null;
      // lat/lon diambil dari gps, gunakan nilai terakhir yang valid jika bernilai 0
      const rawLat = typeof gps.lat === "number" ? gps.lat : null;
      const rawLon = typeof gps.lng === "number" ? gps.lng : (typeof gps.lon === "number" ? gps.lon : null);
      
      // Update posisi terakhir yang valid jika data baru tidak nol
      if (rawLat !== null && rawLat !== 0) lastValidLat = rawLat;
      if (rawLon !== null && rawLon !== 0) lastValidLon = rawLon;
      
      // Gunakan posisi terakhir yang valid jika data baru nol
      const lat = (rawLat === 0 || rawLat === null) ? lastValidLat : rawLat;
      const lon = (rawLon === 0 || rawLon === null) ? lastValidLon : rawLon;
      
      // speed_kn diambil dari gps jika ada
      const speed_kn = typeof gps.speed_knots === "number" ? gps.speed_knots : null;

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
          gps,
          timestamp: data?.timestamp ?? "",
        },
      } as TelemetryNode;
    })
    .filter((n) => n.timestamp instanceof Date)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const latest = nodes[nodes.length - 1]?.data ?? null

  return {
    ordered: nodes,
    latest,
  }
}
