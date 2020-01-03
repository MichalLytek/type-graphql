export default function isPromiseLike<TValue>(
  value: PromiseLike<TValue> | TValue,
): value is PromiseLike<TValue> {
  return value != null && typeof (value as PromiseLike<TValue>).then === "function";
}
