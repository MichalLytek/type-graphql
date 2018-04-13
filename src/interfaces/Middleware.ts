import { ActionData } from "../types";

export type BeforeMiddleware<TContext = {}> = (action: ActionData<TContext>) => void;

export type AfterMiddleware<TContext = {}> = (
  action: ActionData<TContext>,
  resolverValue?: any,
) => void;
