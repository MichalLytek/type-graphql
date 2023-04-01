import type { MiddlewareFn } from "@/typings/Middleware";
import { UseMiddleware } from "./UseMiddleware";

export function createMethodDecorator<TContextType = {}>(
  resolver: MiddlewareFn<TContextType>,
): MethodDecorator {
  return UseMiddleware(resolver);
}
