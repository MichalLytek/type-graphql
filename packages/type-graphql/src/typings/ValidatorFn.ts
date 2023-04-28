import type { TypeValue } from "@/decorators/types";

export type ValidatorFn<T extends object> = (
  argValue: T | undefined,
  argType: TypeValue,
) => void | Promise<void>;
