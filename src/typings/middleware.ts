import { type ResolverData } from "./resolver-data";
import { type MaybePromise } from "./utils";

// Middlewares may resolve synchronously or asynchronously. Returning a plain
// value (not a promise) lets the dispatcher skip the per-middleware microtask,
// which is significant for synchronous middlewares run per field (e.g. auth).
export type NextFn = () => MaybePromise<any>;

export type MiddlewareFn<TContext extends object = object> = (
  action: ResolverData<TContext>,
  next: NextFn,
) => MaybePromise<any>;

export interface MiddlewareInterface<TContext extends object = object> {
  use: MiddlewareFn<TContext>;
}
export type MiddlewareClass<TContext extends object = object> = new (
  ...args: any[]
) => MiddlewareInterface<TContext>;

export type Middleware<TContext extends object = object> =
  | MiddlewareFn<TContext>
  | MiddlewareClass<TContext>;
