"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { useTelemetry } from "./telemetry-provider"
import { Compass, MapIcon } from "lucide-react"

const LazyLeaflet = dynamic(() => import("./map-track.leaflet"), { ssr: false })

export function MapTrack() {
  const { feed } = useTelemetry()
  const [ready, setReady] = useState(false)

  const coords = useMemo(() => {
    const pts = (feed?.ordered ?? [])
      .map((n) => {
        let lat = n.data?.sensors?.lat;
        let lon = n.data?.sensors?.lon;
        // Jika tidak ada di sensors, ambil dari gps
        if ((typeof lat !== "number" || Number.isNaN(lat)) && n.data?.gps) {
          lat = n.data.gps.lat;
        }
        if ((typeof lon !== "number" || Number.isNaN(lon)) && n.data?.gps) {
          lon = n.data.gps.lng ?? n.data.gps.lon;
        }
        const ok = typeof lat === "number" && typeof lon === "number" && !Number.isNaN(lat) && !Number.isNaN(lon);
        return ok ? ([lat, lon] as [number, number]) : null;
      })
      .filter(Boolean) as [number, number][];
    return pts;
  }, [feed]);

  const latest = feed?.latest;
  let latestLat = latest?.sensors?.lat;
  let latestLon = latest?.sensors?.lon;
  if ((typeof latestLat !== "number" || Number.isNaN(latestLat)) && latest?.gps) {
    latestLat = latest.gps.lat;
  }
  if ((typeof latestLon !== "number" || Number.isNaN(latestLon)) && latest?.gps) {
    latestLon = latest.gps.lng ?? latest.gps.lon;
  }
  const latestPoint =
    typeof latestLat === "number" && typeof latestLon === "number"
      ? ([latestLat, latestLon] as [number, number])
      : null;
  // Map tetap tampil jika koordinat valid, meskipun gps_status bukan 'valid', 'fix', '3d', atau '2d'
  const hasFix = latestPoint !== null;

  return (
    <div className="relative h-full min-h-[320px] w-full rounded-xl">
      <div className="absolute right-3 top-3 z-[400] flex items-center gap-2 rounded-xl border border-black dark:border-border bg-white/80 dark:bg-background/70 px-2 py-1 text-xs backdrop-blur-xl">
        <MapIcon className="h-4 w-4" />
        <span className="text-black dark:text-muted-foreground">Leaflet</span>
        <span className="mx-1 opacity-50">•</span>
        <Compass className="h-4 w-4" />
        <span className="text-black dark:text-muted-foreground">{hasFix ? "GPS fix" : "GPS invalid"}</span>
      </div>

      {coords.length > 0 && latestPoint && hasFix ? (
        <LazyLeaflet coords={coords} latest={latestPoint} onReady={() => setReady(true)} />
      ) : (
        <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-xl border border-black dark:border-border">
          <div className="text-center">
            <p className="text-sm text-black dark:text-muted-foreground">Lokasi tidak tersedia</p>
            <p className="text-xs text-black/70 dark:text-muted-foreground/80">
              GPS invalid atau koordinat tidak ada. Menampilkan fallback.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
