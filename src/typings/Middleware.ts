import type { ResolverData } from "./ResolverData";

export type NextFn = () => Promise<any>;

export type MiddlewareFn<TContext extends object = object> = (
  action: ResolverData<TContext>,
  next: NextFn,
) => Promise<any>;

export type MiddlewareInterface<TContext extends object = object> = {
  use: MiddlewareFn<TContext>;
};
export type MiddlewareClass<TContext extends object = object> = new (
  ...args: any[]
) => MiddlewareInterface<TContext>;

export type Middleware<TContext extends object = object> =
  | MiddlewareFn<TContext>
  | MiddlewareClass<TContext>;
