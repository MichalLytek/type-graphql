import type { MiddlewareFn } from "@/typings/Middleware";
import { UseMiddleware } from "./UseMiddleware";

export function createMethodDecorator<TContextType extends object = object>(
  resolver: MiddlewareFn<TContextType>,
): MethodDecorator {
  return UseMiddleware(resolver);
}
