export function clamp(value: number | null, min: number, max: number): number {
  if (value === null || Number.isNaN(value)) return min
  return Math.max(min, Math.min(max, value))
}

export function average(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}
