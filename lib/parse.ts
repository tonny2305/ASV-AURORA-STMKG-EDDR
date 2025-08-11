const TZ_OFFSET_WIB_HOURS = 7

// Parse "DD/MM/YYYY:HH:MM:SS" as Asia/Jakarta time into a Date object.
export function parseTimestamp(input: string): Date {
  // Accept either formatted string or number
  if (/^\d+$/.test(input)) {
    // If input is a number (epoch seconds or ms), convert to Date
    const num = Number(input)
    // If length > 10, treat as ms
    const date = new Date(num > 1e10 ? num : num * 1000)
    return date
  }
  // Expect: 10/08/2025:13:45:24
  const [datePart, timePart] = input.split(":").length >= 3 ? [input.slice(0, 10), input.slice(11)] : input.split(" ")
  const [dd, mm, yyyy] = (datePart ?? "").split("/").map((v) => Number.parseInt(v, 10))
  const [HH, MM, SS] = (timePart ?? "").split(":").map((v) => Number.parseInt(v, 10))

  const y = isNaN(yyyy) ? 1970 : yyyy
  const M = isNaN(mm) ? 1 : mm
  const d = isNaN(dd) ? 1 : dd
  // Validasi jam, menit, detik
  let h = isNaN(HH) ? 0 : HH
  let m = isNaN(MM) ? 0 : MM
  let s = isNaN(SS) ? 0 : SS
  h = Math.max(0, Math.min(h, 23));
  m = Math.max(0, Math.min(m, 59));
  s = Math.max(0, Math.min(s, 59));

  // Convert WIB (UTC+7) to UTC epoch
  const epoch = Date.UTC(y, M - 1, d, h - TZ_OFFSET_WIB_HOURS, m, s)
  return new Date(epoch)

// ...existing code...

// ...existing code...
}

// Format Date to "DD/MM/YYYY:HH:MM:SS" WIB
export function formatTimestampWIB(date: Date): string {
  const d = date;
  const tzDate = new Date(d.getTime() + (420 - d.getTimezoneOffset()) * 60000); // WIB offset
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(tzDate.getDate())}/${pad(tzDate.getMonth() + 1)}/${tzDate.getFullYear()}:${pad(tzDate.getHours())}:${pad(tzDate.getMinutes())}:${pad(tzDate.getSeconds())}`;
// ...existing code...
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
