import { ResolverData } from ".";
import { TypeValue } from "../decorators/types";

export type ValidatorFn<ContextType, T extends object> = (
  resolverdata: ResolverData<ContextType>,
  argValue: T | undefined,
  argType: TypeValue,
) => void | Promise<void>;
