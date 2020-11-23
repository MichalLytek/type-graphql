export function getTime(date: Date = new Date()) {
  return date.toTimeString().slice(0, 8);
}
