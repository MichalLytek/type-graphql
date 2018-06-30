export function isThrowing(fn: () => void) {
  try {
    fn();
    return false;
  } catch {
    return true;
  }
}
