import { HeaderBrand } from "@/components/header-brand"
import { MapTrack } from "@/components/map-track"
import { ShipScene } from "@/components/ship-scene"
import { SpeedHeadingCard } from "@/components/speed-heading-card"
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
        ["--glass-bg" as any]: "hsl(240 10% 10% / 0.5)", // dark glass only
        ["--glass-border" as any]: "hsl(240 10% 20% / 0.35)",
      }}
    >
      <TelemetryProvider>
        <div className="grid h-full w-full grid-rows-[auto_1fr]">
          <HeaderBrand />
          {/* Three columns: left Trends, center Map, right Parameters */}
          <main className="grid min-h-0 grid-cols-12 gap-3 overflow-auto px-3 pb-3 pt-0 md:gap-4 md:px-4">
            {/* LEFT: Trends (full height, vertical stack) */}
            <section className="col-span-12 md:col-span-3 min-h-0 min-w-0 rounded-xl border border-black dark:border-[var(--glass-border)] bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl">
              <Sparklines />
            </section>

            {/* CENTER: Map */}
            <section className="col-span-12 md:col-span-5 min-h-0 rounded-xl border border-black dark:border-[var(--glass-border)] bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl">
              <MapTrack />
            </section>

            {/* RIGHT: Parameters */}
            <section className="col-span-12 md:col-span-4 grid h-full min-h-0 [grid-template-rows:repeat(6,minmax(0,1fr))] gap-3 md:gap-4">
              <div className="row-span-2 min-h-0 rounded-xl border border-black dark:border-[var(--glass-border)] bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl">
                <ShipScene />
              </div>
              <div className="row-span-1 min-h-0 rounded-xl border border-black dark:border-[var(--glass-border)] bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl">
                <SpeedHeadingCard />
              </div>
              <div className="row-span-1 min-h-0 rounded-xl border border-black dark:border-[var(--glass-border)] bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl">
                <EnvGauges />
              </div>
              <div className="row-span-1 min-h-0 rounded-xl border border-black dark:border-[var(--glass-border)] bg-white dark:bg-[var(--glass-bg)] backdrop-blur-xl">
                <DataBadges />
              </div>
            </section>
          </main>
        </div>
      </TelemetryProvider>
    </div>
  )
}
