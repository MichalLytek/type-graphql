import { UseMiddleware } from "./UseMiddleware";
import { MiddlewareFn } from "../interfaces/Middleware";
import { MethodPropClassDecorator } from "./types";

export function createMiddlewareDecorator<TContextType = {}>(
  resolver: MiddlewareFn<TContextType>,
): MethodPropClassDecorator {
  return UseMiddleware(resolver);
}
