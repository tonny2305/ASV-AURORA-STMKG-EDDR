"use client"

import { HeaderBrand } from "@/components/header-brand"
import { MapTrack } from "@/components/map-track"
import { ShipScene } from "@/components/ship-scene"
import SpeedHeadingCard from "@/components/speed-heading-card"
import { EnvGauges } from "@/components/env-gauges"
import { DataBadges } from "@/components/data-badges"
import { Sparklines } from "@/components/sparklines"
import { TelemetryProvider } from "@/components/telemetry-provider"

export default function Page() {
  return (
    <div
      className="h-dvh w-full overflow-hidden bg-white text-black dark:bg-background dark:text-foreground"
      style={{
        ["--accent-cyan" as any]: "hsl(185 85% 60%)",
        ["--accent-teal" as any]: "hsl(170 80% 55%)",
        ["--accent-purple" as any]: "hsl(265 90% 70%)",
        ["--glass-bg" as any]: "hsl(240 10% 10% / 0.5)",
        ["--glass-border" as any]: "hsl(240 10% 20% / 0.35)",
      }}
    >
      <TelemetryProvider>
        <div className="grid h-full w-full grid-rows-[auto_1fr]">
          <HeaderBrand />

          {/* layout 3 kolom */}
          <main className="grid min-h-0 grid-cols-12 gap-3 overflow-auto px-3 pb-3 md:gap-4 md:px-4">
            {/* LEFT – Trends */}
            <section className="col-span-12 min-h-0 min-w-0 rounded-xl border border-black bg-white/70 backdrop-blur-xl dark:border-[var(--glass-border)] dark:bg-[var(--glass-bg)] md:col-span-3">
              <Sparklines />
            </section>

            {/* CENTER – Map */}
            <section className="col-span-12 min-h-0 rounded-xl border border-black bg-white/70 backdrop-blur-xl dark:border-[var(--glass-border)] dark:bg-[var(--glass-bg)] md:col-span-5">
              <MapTrack />
            </section>

            {/* RIGHT – Parameters (fix overlap: use flex, not grid row-span) */}
            <section className="col-span-12 flex min-h-0 flex-col gap-3 md:col-span-4 md:gap-4">
              <div className="rounded-xl border border-black bg-white/70 backdrop-blur-xl dark:border-[var(--glass-border)] dark:bg-[var(--glass-bg)] overflow-hidden">
                {/* beri tinggi eksplisit agar stabil */}
                <div className="h-56 md:h-64">
                  <ShipScene />
                </div>
              </div>

              <div className="rounded-xl border border-black bg-white/70 backdrop-blur-xl dark:border-[var(--glass-border)] dark:bg-[var(--glass-bg)] overflow-hidden">
                <SpeedHeadingCard />
              </div>

              <div className="rounded-xl border border-black bg-white/70 backdrop-blur-xl dark:border-[var(--glass-border)] dark:bg-[var(--glass-bg)] overflow-hidden">
                <EnvGauges />
              </div>

              <div className="rounded-xl border border-black bg-white/70 backdrop-blur-xl dark:border-[var(--glass-border)] dark:bg-[var(--glass-bg)] overflow-hidden">
                <DataBadges />
              </div>
            </section>
          </main>
        </div>
      </TelemetryProvider>
    </div>
  )
}
