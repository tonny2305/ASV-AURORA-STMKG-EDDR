"use client"
"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useMemo } from "react"
import { useTelemetry } from "./telemetry-provider"
import { formatRawTimestamp } from "./sparklines-format"

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
  // Ambil value-value statistik
  const values = cleaned.map(d => d[dataKey]).filter(v => typeof v === "number")
  const last = values.length ? values[values.length-1] : null
  const avg = values.length ? (values.reduce((a,b)=>a+b,0)/values.length) : null
  const min = values.length ? Math.min(...values) : null
  const max = values.length ? Math.max(...values) : null
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-black dark:border-border p-3">
      <div className="mb-2 truncate text-xs text-black dark:text-muted-foreground">{title}</div>
      <div className="mb-2 flex gap-4 text-xs text-black dark:text-muted-foreground">
        <span>Last: <b>{last !== null ? last.toFixed(2) : '-'}</b></span>
        <span>Avg: <b>{avg !== null ? avg.toFixed(2) : '-'}</b></span>
        <span>Min: <b>{min !== null ? min.toFixed(2) : '-'}</b></span>
        <span>Max: <b>{max !== null ? max.toFixed(2) : '-'}</b></span>
      </div>
      <div className="relative h-[110px] md:h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cleaned}>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              cursor={{ stroke: "#8884d8", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value;
                  // Cek dark mode dari document.documentElement.classList
                  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
                  return (
                    <div
                      style={{
                        background: isDark ? "#222" : "#fff",
                        color: isDark ? "#eee" : "#222",
                        border: `1px solid ${isDark ? '#444' : '#ccc'}`,
                        padding: 8,
                        borderRadius: 6,
                        fontSize: 12,
                        boxShadow: isDark ? "0 2px 8px #0006" : "0 2px 8px #ccc6"
                      }}
                    >
                      <div><b>Value:</b> {value}</div>
                      <div><b>Timestamp:</b> {formatRawTimestamp(label)}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="basis"
              dataKey={dataKey}
              stroke={colorDark}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              className="dark:stroke-[hsl(170_80%_55%)]"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
