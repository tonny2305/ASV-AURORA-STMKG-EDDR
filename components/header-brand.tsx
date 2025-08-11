"use client"

import Image from "next/image"
import { Wifi, Moon, Sun } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { formatAbsoluteWIB, formatRelative } from "@/lib/parse"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function HeaderBrand() {
  const { connected, lastUpdate } = useTelemetry()
  const [dark, setDark] = useState(true)

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [dark])

  const { feed } = useTelemetry();
  // Ambil timestamp mentah dari data terbaru
  let rawTimestamp = feed?.latest?.timestamp || "—";
  // Format agar lebih mudah dibaca: "10/08/2025:18/48/29" => "10-08-2025 18:48:29"
  if (typeof rawTimestamp === "string" && rawTimestamp.includes(":")) {
    const [date, time] = rawTimestamp.split(":");
    if (date && time) {
      rawTimestamp = `${date.replaceAll("/", "-")} ${time.replaceAll("/", ":")}`;
    }
  }
  const relative = lastUpdate ? formatRelative(lastUpdate) : "—";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black dark:border-border bg-white/80 dark:bg-background/70 px-3 py-2 backdrop-blur-xl md:px-4">
      <div className="flex items-center gap-3">
        <Image src="/logo-aurora.png" alt="AURORA STMKG" width={36} height={36} className="opacity-90" />
        <div className="flex flex-col">
          <h1 className="text-base font-semibold tracking-tight md:text-lg">ASV Monitoring — AURORA STMKG</h1>
          <p className="text-xs text-black dark:text-muted-foreground">
            Last Update: {rawTimestamp}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${connected ? "border-emerald-600 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300" : "border-amber-600 text-amber-700 dark:border-amber-500/40 dark:text-amber-300"}`}
          aria-label={connected ? "Koneksi: Live" : "Koneksi: Reconnecting"}
          title={connected ? "Live" : "Reconnecting"}
        >
          <Wifi
            className={`h-3.5 w-3.5 ${connected ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}
          />
          {connected ? "Live" : "Reconnecting"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:shadow-[0_0_20px_var(--accent-purple)]"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  )
}
