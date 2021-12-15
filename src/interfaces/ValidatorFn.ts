import { TypeValue } from "../decorators/types";

export type ValidatorFn<TContext, T extends object> = (
  context: TContext,
  argValue: T | undefined,
  argType: TypeValue,
) => void | Promise<void>;
