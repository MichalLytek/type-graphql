import { MiddlewareFn } from "../../../src";

export function NumberInterceptor(minValue: number): MiddlewareFn {
  return async (_, next) => {
    const result = await next();
    // hide ratings below minValue
    if (typeof result === "number" && result < minValue) {
      return null;
    }
    return result;
  };
}
