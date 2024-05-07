import { type MiddlewareFn } from "@/typings";
import { UseMiddleware } from "./UseMiddleware";

export function createClassMiddlewareDecorator<TContextType extends object = object>(
  resolver: MiddlewareFn<TContextType>,
): ClassDecorator {
  return UseMiddleware(resolver);
}
