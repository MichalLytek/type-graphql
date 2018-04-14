import { ActionData } from "../types";

export type NextFunction = () => Promise<any>;

export type Middleware<TContext = {}> = (
  action: ActionData<TContext>,
  next: NextFunction,
) => Promise<any>;
