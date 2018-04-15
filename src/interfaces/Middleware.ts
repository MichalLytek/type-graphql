import { ActionData } from "../types";

export type NextFunction = () => Promise<any>;

export type MiddlewareFn<TContext = {}> = (
  action: ActionData<TContext>,
  next: NextFunction,
) => Promise<any>;

export interface MiddlewareInterface<TContext = {}> {
  resolve: MiddlewareFn<TContext>;
}
export interface MiddlewareClass<TContext = {}> {
  new (): MiddlewareInterface<TContext>;
}

export type Middleware<TContext = {}> = MiddlewareFn<TContext> | MiddlewareClass<TContext>;
