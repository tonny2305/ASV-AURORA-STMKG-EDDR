const TZ_OFFSET_WIB_HOURS = 7

// Parse "DD/MM/YYYY:HH:MM:SS" as Asia/Jakarta time into a Date object.
export function parseTimestamp(input: string): Date {
  // Expect: 10/08/2025:13:45:24
  const [datePart, timePart] = input.split(":").length >= 3 ? [input.slice(0, 10), input.slice(11)] : input.split(" ")
  const [dd, mm, yyyy] = (datePart ?? "").split("/").map((v) => Number.parseInt(v, 10))
  const [HH, MM, SS] = (timePart ?? "").split(":").map((v) => Number.parseInt(v, 10))

  const y = isNaN(yyyy) ? 1970 : yyyy
  const M = isNaN(mm) ? 1 : mm
  const d = isNaN(dd) ? 1 : dd
  const h = isNaN(HH) ? 0 : HH
  const m = isNaN(MM) ? 0 : MM
  const s = isNaN(SS) ? 0 : SS

  // Convert WIB (UTC+7) to UTC epoch
  const epoch = Date.UTC(y, M - 1, d, h - TZ_OFFSET_WIB_HOURS, m, s)
  return new Date(epoch)
}

// Absolute time in WIB in a friendly format.
export function formatAbsoluteWIB(d: Date): string {
  return (
    d
      .toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "") + " WIB"
  )
}

// Relative time, e.g., "6s ago"
export function formatRelative(d: Date): string {
  const diff = Math.max(0, Date.now() - d.getTime())
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}

export function headingToRotation(headingDeg: number): number {
  // normalize to 0-359
  const h = ((headingDeg % 360) + 360) % 360
  return h
}
