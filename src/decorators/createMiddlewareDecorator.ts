import { type MiddlewareFn } from "@/typings";
import { type MethodPropClassDecorator } from "./types";
import { UseMiddleware } from "./UseMiddleware";

export function createMiddlewareDecorator<TContextType extends object = object>(
  resolver: MiddlewareFn<TContextType>,
): MethodPropClassDecorator {
  return UseMiddleware(resolver);
}
