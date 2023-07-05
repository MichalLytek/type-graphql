import { UseMiddleware } from "./UseMiddleware";
import { MiddlewareFn } from "../interfaces/Middleware";

export function createMethodDecorator<TContextType extends object = object>(
  resolver: MiddlewareFn<TContextType>,
): MethodDecorator {
  return UseMiddleware(resolver);
}
