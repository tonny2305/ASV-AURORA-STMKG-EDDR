"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Gauge, Compass } from "lucide-react"
import { useTelemetry } from "./telemetry-provider"
import { clamp } from "@/lib/math"

// Batas data sensor
const MAX_KNOT_DATA = 100
const MAX_KMH_DATA  = 100

// Batas TAMPILAN (samakan dg label yang kamu mau)
const MAX_KNOT_DISPLAY = 100  // 0–5–10–...–100
const MAX_KMH_DISPLAY  = 100  // 0–5–10–...–100

/** ---------- Semi-circle gauge (SOG) ---------- */
function SemiGauge({ value, displayMax, label, unit, reduce }) {
  const v = clamp(value ?? 0, 0, displayMax)
  // Sudut jarum: 0 di kanan (0°), max di kiri (360°), searah jarum jam
  const angle = (v / displayMax) * 360

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-white/90">{label}</div>
        <div className="text-[10px] text-white/50">{unit}</div>
      </div>

      <div className="relative mx-auto w-full max-w-[240px]">
        <svg viewBox="0 0 200 200" className="block w-full">
          {/* Arc lingkaran penuh */}
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--accent-cyan)" strokeWidth="10" opacity="0.18" />
          {/* Ticks kelipatan 2, label radius lebih besar, label horizontal */}
            {Array.from({length: displayMax+1}, (_, i) => {
              if (i % 5 !== 0 && i !== 0) return null;
              if (i === displayMax) return null;
              // Sudut label: lingkaran penuh, 0 di atas
              const deg = 270 + (i / displayMax) * 360;
              const a = deg * Math.PI / 180;
              const r1 = 86, r2 = 76;
              const x1 = (100 + Math.cos(a)*r1).toFixed(2), y1 = (100 + Math.sin(a)*r1).toFixed(2);
              const x2 = (100 + Math.cos(a)*r2).toFixed(2), y2 = (100 + Math.sin(a)*r2).toFixed(2);
              const lx = (100 + Math.cos(a)*72).toFixed(2), ly = (100 + Math.sin(a)*72).toFixed(2);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1" opacity="0.25" />
                  <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" fontSize="12" fill="#fff" opacity="0.8">{i}</text>
                </g>
              );
            })}
          {/* Needle: titik bulat di tengah, ujung jarum ke angka */}
          <g>
            {/* Titik bulat putih di tengah gauge */}
            <circle cx="100" cy="100" r="7" fill="var(--accent-cyan)" stroke="white" strokeWidth="2" />
            {/* Jarum dari tengah ke tepi sesuai sudut */}
            <motion.line
              x1="100" y1="100"
              x2={(100 + Math.cos((angle-90)*Math.PI/180)*78).toFixed(2)}
              y2={(100 + Math.sin((angle-90)*Math.PI/180)*78).toFixed(2)}
              stroke="var(--accent-cyan)"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              animate={{}}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 14 }}
            />
          </g>
        </svg>
      </div>

      <div className="mt-2 text-center text-3xl font-extrabold text-[var(--accent-cyan)] tabular-nums">
        {v.toFixed(2)} <span className="text-base font-semibold text-white/70">{unit}</span>
      </div>
    </div>
  )
}

/** ---------- Compass (Heading / COG) ---------- */
function CompassGauge({ heading, reduce }: { heading: number; reduce: boolean }) {
  const h = clamp(heading ?? 0, 0, 359)
  // Sudut jarum: 0° di atas (N), searah jarum jam
  const headingAngle = 270 + h

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <Compass className="h-4 w-4 text-[var(--accent-cyan)]" />
          Heading
        </div>
        <div className="text-[10px] text-white/50">degrees</div>
      </div>

      <div className="relative mx-auto w-full max-w-[240px]">
        <svg viewBox="0 0 200 200" className="block w-full">
          <circle cx="100" cy="100" r="84" fill="none" stroke="var(--accent-cyan)" strokeWidth="12" opacity="0.18" />
          {/* Label N E S W */}
          {[{t:"N",x:100,y:22},{t:"E",x:178,y:102},{t:"S",x:100,y:182},{t:"W",x:22,y:102}].map(d=>(
            <text key={d.t} x={d.x} y={d.y} textAnchor="middle" alignmentBaseline="middle" fontSize="16" fill="#fff" opacity="0.95">{d.t}</text>
          ))}
          {/* Angka derajat setiap 45° */}
          {Array.from({length: 8}, (_, i) => {
            const deg = i * 45;
            const angle = 270 + deg;
            const a = angle * Math.PI / 180;
            const r = 70;
            const x = (100 + Math.cos(a)*r).toFixed(2);
            const y = (100 + Math.sin(a)*r).toFixed(2);
            return (
              <text key={deg} x={x} y={y} textAnchor="middle" alignmentBaseline="middle" fontSize="13" fill="#fff" opacity="0.8">{deg}</text>
            );
          })}
          {/* Titik bulat putih di tengah gauge */}
          <circle cx="100" cy="100" r="8" fill="var(--accent-cyan)" stroke="white" strokeWidth="2" />
          {/* Jarum dari tengah ke tepi sesuai sudut heading */}
          <motion.line
            x1="100" y1="100"
            x2={(100 + Math.cos((headingAngle)*Math.PI/180)*72).toFixed(2)}
            y2={(100 + Math.sin((headingAngle)*Math.PI/180)*72).toFixed(2)}
            stroke="var(--accent-cyan)"
            strokeWidth="6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            animate={{}}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 14 }}
          />
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6 text-white">
        <div className="text-center">
          <div className="text-xs uppercase tracking-wide text-white/60">Heading</div>
          <div className="text-2xl font-bold tabular-nums">{Math.round(h)}°</div>
        </div>
      </div>
    </div>
  )
}

/** ---------- Main Card ---------- */
export default function SpeedHeadingCard() {
  const { feed } = useTelemetry()
  const reduce = useReducedMotion()
  const sensors = feed?.latest?.sensors as import("@/types/asv").Sensors | undefined;
  const gps = feed?.latest?.gps;

  // Ambil data speed_kn dari sensors.speed_kn atau gps.speed_knots
  const speedKnRaw =
    sensors?.speed_kn != null && Number.isFinite(sensors.speed_kn) ? Number(sensors.speed_kn) :
    gps?.speed_knots != null && Number.isFinite(gps.speed_knots) ? Number(gps.speed_knots) : 0;

  // Ambil data speed_kmh dari gps.speed_kmh jika ada, jika tidak konversi dari speedKnRaw
  const speedKmhRaw =
    gps?.speed_kmh != null && Number.isFinite(gps.speed_kmh) ? Number(gps.speed_kmh) : (speedKnRaw * 1.852);

  const headingRaw = sensors?.heading_deg != null && Number.isFinite(sensors.heading_deg) ? Number(sensors.heading_deg) : 0;
  const cogRaw = gps?.course_deg != null && Number.isFinite(gps.course_deg) ? Number(gps.course_deg) : undefined;

  // Clamp ke range data
  const speedKn = clamp(speedKnRaw, 0, MAX_KNOT_DATA);
  const speedKmh = clamp(speedKmhRaw, 0, MAX_KMH_DATA);
  const heading = clamp(headingRaw, 0, 359);

  return (
    <div className="w-full rounded-2xl bg-[#0e141b] shadow-xl ring-1 ring-white/5">
      <div className="flex items-end justify-between gap-3 border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2.5 text-sm font-semibold">
          <Gauge className="h-5 w-5 text-[var(--accent-cyan)]" />
          <span className="text-white">Realtime Gauges</span>
        </div>
        <div className="text-[10px] font-medium text-white/50">real-time metrics</div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-4">
        <SemiGauge value={speedKn}  displayMax={MAX_KNOT_DISPLAY} label="Speed over ground" unit="kn"   reduce={!!reduce} />
        <SemiGauge value={speedKmh} displayMax={MAX_KMH_DISPLAY}  label="Speed over ground" unit="km/h" reduce={!!reduce} />
        <CompassGauge heading={heading} reduce={!!reduce} />
        <COGGauge cog={cogRaw} reduce={!!reduce} />
      </div>
    </div>
  )
/** ---------- COG Gauge ---------- */
function COGGauge({ cog, reduce }: { cog: number | undefined; reduce: boolean }) {
  const c = clamp(cog ?? 0, 0, 359)
  // Sudut jarum: 0° di atas (N), searah jarum jam
  const cogAngle = 270 + c
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <Compass className="h-4 w-4 text-[var(--accent-cyan)]" />
          COG
        </div>
        <div className="text-[10px] text-white/50">degrees</div>
      </div>
      <div className="relative mx-auto w-full max-w-[240px]">
        <svg viewBox="0 0 200 200" className="block w-full">
          <circle cx="100" cy="100" r="84" fill="none" stroke="var(--accent-cyan)" strokeWidth="12" opacity="0.18" />
          {/* Label N E S W */}
          {[{t:"N",x:100,y:22},{t:"E",x:178,y:102},{t:"S",x:100,y:182},{t:"W",x:22,y:102}].map(d=>(
            <text key={d.t} x={d.x} y={d.y} textAnchor="middle" alignmentBaseline="middle" fontSize="16" fill="#fff" opacity="0.95">{d.t}</text>
          ))}
          {/* Angka derajat setiap 45° */}
          {Array.from({length: 8}, (_, i) => {
            const deg = i * 45;
            const angle = 270 + deg;
            const a = angle * Math.PI / 180;
            const r = 70;
            const x = (100 + Math.cos(a)*r).toFixed(2);
            const y = (100 + Math.sin(a)*r).toFixed(2);
            return (
              <text key={deg} x={x} y={y} textAnchor="middle" alignmentBaseline="middle" fontSize="13" fill="#fff" opacity="0.8">{deg}</text>
            );
          })}
          {/* Titik bulat putih di tengah gauge */}
          <circle cx="100" cy="100" r="8" fill="var(--accent-cyan)" stroke="white" strokeWidth="2" />
          {/* Jarum dari tengah ke tepi sesuai sudut COG */}
          <motion.line
            x1="100" y1="100"
            x2={(100 + Math.cos((cogAngle)*Math.PI/180)*72).toFixed(2)}
            y2={(100 + Math.sin((cogAngle)*Math.PI/180)*72).toFixed(2)}
            stroke="orange"
            strokeWidth="6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            animate={{}}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 14 }}
          />
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-center gap-6 text-white">
        <div className="text-center">
          <div className="text-xs uppercase tracking-wide text-white/60">COG</div>
          <div className="text-2xl font-bold tabular-nums">{Number.isFinite(c) ? `${Math.round(Number(c))}°` : "—"}</div>
        </div>
      </div>
    </div>
  )
}
}
