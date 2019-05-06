import { UseMiddleware } from "./UseMiddleware";
import { MiddlewareFn } from "../interfaces/Middleware";

export function createMethodDecorator<TContextType = {}>(
  resolver: MiddlewareFn<TContextType>,
): MethodDecorator {
  return UseMiddleware(resolver);
}
