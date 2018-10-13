import { ReturnTypeFunc, DescriptionOptions } from "../decorators/types";

export interface TypeDecoratorParams<T> {
  options: Partial<T>;
  returnTypeFunc?: ReturnTypeFunc;
}
export function getTypeDecoratorParams<T extends object>(
  returnTypeFuncOrOptions: ReturnTypeFunc | T | undefined,
  maybeOptions: T | undefined,
): TypeDecoratorParams<T> {
  if (typeof returnTypeFuncOrOptions === "function") {
    return {
      returnTypeFunc: returnTypeFuncOrOptions as ReturnTypeFunc,
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
      options: maybeOptions || ({} as T),
    };
  } else {
    return {
      options: nameOrOptions || ({} as T),
    };
  }
}

export function getArrayFromOverloadedRest<T>(overloadedArray: Array<T | T[]>): T[] {
  let items: T[];
  if (Array.isArray(overloadedArray[0])) {
    items = overloadedArray[0] as T[];
  } else {
    items = overloadedArray as T[];
  }
  return items;
}
