// Format raw timestamp string to 'DD-MM-YYYY HH:MM:SS'
export function formatRawTimestamp(raw: string): string {
  if (typeof raw !== "string" || !raw.includes(":")) return raw;
  const [date, time] = raw.split(":");
  if (date && time) {
    return `${date.replaceAll("/", "-")} ${time.replaceAll("/", ":")}`;
  }
  return raw;
}
