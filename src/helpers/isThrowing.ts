export function isThrowing(fn: () => void): boolean {
  try {
    fn()
    return false
  } catch {
    return true
  }
}
