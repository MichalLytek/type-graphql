import { type MiddlewareFn } from "@/typings/middleware";
import { UseMiddleware } from "./UseMiddleware";

export function createMethodDecorator<TContextType extends object = object>(
  resolver: MiddlewareFn<TContextType>,
): MethodDecorator {
  return UseMiddleware(resolver);
}
