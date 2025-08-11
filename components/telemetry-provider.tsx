"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { onValue, query, ref, limitToLast } from "firebase/database"
import { db } from "@/lib/firebase"
import { normalizeFeed } from "@/lib/rtdb"
import type { TelemetryFeed } from "@/types/asv"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { parseTimestamp } from "@/lib/parse"
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics"

type TelemetryContextType = {
  feed: TelemetryFeed | null
  latestKey: string | null
  connected: boolean
  lastUpdate: Date | null
}

const TelemetryContext = createContext<TelemetryContextType>({
  feed: null,
  latestKey: null,
  connected: false,
  lastUpdate: null,
})

// Firebase RTDB paths should not start with a leading slash
const TELEMETRY_PATH = "asv/sensor_readings"
const LIMIT = 100

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Record<string, any> | null>(null)
  const [connected, setConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  useEffect(() => {
    // Initialize Analytics client-side only when supported
    let cancelled = false
    isSupported()
      .then((ok) => {
        if (ok && !cancelled) {
          import("@/lib/firebase").then(({ app }) => {
            try {
              const a = getAnalytics(app)
              setAnalytics(a)
            } catch {
              // ignore analytics init errors (e.g., in unsupported envs)
            }
          })
        }
      })
      .catch(() => {})

    const q = query(ref(db, TELEMETRY_PATH), limitToLast(LIMIT))
    console.log("🔥 Firebase RTDB query path:", TELEMETRY_PATH)
    const off = onValue(
      q,
      (snap) => {
        const val = snap.val() as Record<string, any> | null
        console.log("🔥 Firebase RTDB data received:", val)
        setRaw(val)
        if (val) {
          const entries = Object.entries(val)
          console.log("📊 Processing entries:", entries.length)
          const latestNode = entries
            .map(([k, v]) => ({ k, t: v?.timestamp }))
            .filter((x) => typeof x.t === "string" || typeof x.t === "number")
            .map((x) => ({ k: x.k, d: parseTimestamp(String(x.t)) }))
            .sort((a, b) => a.d.getTime() - b.d.getTime())
            .pop()
          if (latestNode) {
            setLastUpdate(latestNode.d)
          }
        }
        setConnected(true)
      },
      (error) => {
        console.error("🔥 Firebase RTDB error:", error)
        setConnected(false)
      },
    )
    return () => {
      cancelled = true
      off()
    }
  }, [])

  const feed = useMemo(() => (raw ? normalizeFeed(raw) : null), [raw])
  const debouncedFeed = useDebouncedValue(feed, 200)

  const recentConnected = useMemo(() => {
    if (!lastUpdate) return connected
    const dt = Date.now() - lastUpdate.getTime()
    return connected && dt < 12_000 // 12s freshness
  }, [connected, lastUpdate])

  const latestKey = useMemo(() => {
    if (!debouncedFeed?.ordered?.length) return null
    return debouncedFeed.ordered[debouncedFeed.ordered.length - 1]?.key ?? null
  }, [debouncedFeed])

  const value: TelemetryContextType = {
    feed: debouncedFeed,
    latestKey,
    connected: recentConnected,
    lastUpdate,
  }

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>
}

export function useTelemetry() {
  return useContext(TelemetryContext)
}
