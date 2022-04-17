export function getTime(date: Date = new Date()): string {
  return date.toTimeString().slice(0, 8)
}
