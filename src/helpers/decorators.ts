import { TypeOptions, ReturnTypeFunc } from "../types/decorators";

export function getDecoratorParams(
  returnTypeFuncOrOptions: ReturnTypeFunc | TypeOptions | undefined,
  maybeOptions: TypeOptions | undefined,
) {
  if (typeof returnTypeFuncOrOptions === "function") {
    return {
      returnTypeFunc: returnTypeFuncOrOptions,
      options: maybeOptions || {},
    };
  } else {
    return {
      options: returnTypeFuncOrOptions || {},
    };
  }
}
