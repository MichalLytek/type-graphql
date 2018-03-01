import { TypeOptions, ReturnTypeFunc, DescriptionOptions } from "../types/decorators";

export interface TypeDecoratorParams<T> {
  options: Partial<T>;
  returnTypeFunc?: ReturnTypeFunc;
}
export function getTypeDecoratorParams<T extends TypeOptions>(
  returnTypeFuncOrOptions: ReturnTypeFunc | T | undefined,
  maybeOptions: T | undefined,
): TypeDecoratorParams<T> {
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

export function getNameDecoratorParams<T extends DescriptionOptions>(
  nameOrOptions: string | T | undefined,
  maybeOptions: T | undefined,
) {
  if (typeof nameOrOptions === "string") {
    return {
      name: nameOrOptions,
      options: maybeOptions || {} as T,
    };
  } else {
    return {
      options: nameOrOptions || {} as T,
    };
  }
}
