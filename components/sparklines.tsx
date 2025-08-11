"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useMemo } from "react"
import { useTelemetry } from "./telemetry-provider"

export function Sparklines() {
  const { feed } = useTelemetry()
  const data = useMemo(() => {
    return (feed?.ordered ?? []).map((n) => ({
      t: n.data.timestamp,
      temp: typeof n.data.sensors?.temp_c === "number" ? n.data.sensors.temp_c : null,
      press: typeof n.data.sensors?.pressure_hpa === "number" ? n.data.sensors.pressure_hpa : null,
      wave: typeof n.data.sensors?.wave_height === "number" ? n.data.sensors.wave_height : null,
    }))
  }, [feed])

  return (
    <div className="flex h-full min-h-[360px] flex-col p-3">
      <div className="mb-2 text-sm font-medium">Trends (last ~100)</div>
      {/* Vertical stack: Temp, Pressure, Wave */}
      <div className="flex h-full min-h-0 flex-col gap-3">
        <VSpark title="Temp (°C)" colorLight="#000000" colorDark="hsl(265 90% 70%)" dataKey="temp" data={data} />
        <VSpark title="Pressure (hPa)" colorLight="#000000" colorDark="hsl(185 85% 60%)" dataKey="press" data={data} />
        <VSpark title="Wave (m)" colorLight="#000000" colorDark="hsl(170 80% 55%)" dataKey="wave" data={data} />
      </div>
    </div>
  )
}

function VSpark({
  title,
  colorLight,
  colorDark,
  dataKey,
  data,
}: {
  title: string
  colorLight: string
  colorDark: string
  dataKey: "temp" | "press" | "wave"
  data: { t: string; temp: number | null; press: number | null; wave: number | null }[]
}) {
  const cleaned = data.filter((d) => typeof d[dataKey] === "number") as any[]
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-black dark:border-border p-3">
      <div className="mb-2 truncate text-xs text-black dark:text-muted-foreground">{title}</div>
      <div className="relative h-[110px] md:h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cleaned}>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colorDark}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              className="dark:stroke-[hsl(170_80%_55%)]"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
