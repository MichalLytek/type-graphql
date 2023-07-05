import { TypeValue } from "../decorators/types";

export type ValidatorFn = (
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
) => void | Promise<void>;
