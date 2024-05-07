import { type TypeValue } from "@/decorators/types";
import { type ResolverData } from "./resolver-data";

export type ValidatorFn<TContext extends object = object> = (
  /**
   * The value of the argument.
   * It can by of any type, which means:
   * - undefined or null (if the argument is nullable)
   * - primitive type (string, number, boolean)
   * - underlying scalar type (Date, Buffer, etc.)
   * - object type (arg type class instance)
   * - array type (array of any of the above)
   */
  argValue: any | undefined,
  argType: TypeValue,
  resolverData: ResolverData<TContext>,
) => void | Promise<void>;
