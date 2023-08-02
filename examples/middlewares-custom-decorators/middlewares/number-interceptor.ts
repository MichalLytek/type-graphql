import { type MiddlewareFn } from "type-graphql";

export function NumberInterceptor(minValue: number): MiddlewareFn {
  return async (_, next) => {
    const result = await next();
    // Hide ratings below minValue
    if (typeof result === "number" && result < minValue) {
      return null;
    }
    return result;
  };
}
