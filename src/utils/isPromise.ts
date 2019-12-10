export function isPromise<T>(value: PromiseLike<T> | T): value is PromiseLike<T> {
  return Boolean(value && typeof (value as any).then === "function");
}
