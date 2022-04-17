import { DescriptionOptions, ReturnTypeFunc } from '../decorators/types'

export interface TypeDecoratorParams<T> {
  options: Partial<T>
  returnTypeFunc?: ReturnTypeFunc
}

export function getTypeDecoratorParams<T extends object>(
  returnTypeFuncOrOptions: ReturnTypeFunc | T | undefined,
  maybeOptions: T | undefined
): TypeDecoratorParams<T> {
  if (typeof returnTypeFuncOrOptions === 'function') {
    return {
      returnTypeFunc: returnTypeFuncOrOptions,
      options: maybeOptions ?? {}
    }
  } else {
    return {
      options: returnTypeFuncOrOptions ?? {}
    }
  }
}

export function getNameDecoratorParams<T extends DescriptionOptions>(
  nameOrOptions: string | T | undefined,
  maybeOptions: T | undefined
): { name?: string; options: any } {
  if (typeof nameOrOptions === 'string') {
    return {
      name: nameOrOptions,
      options: maybeOptions ?? {}
    }
  } else {
    return {
      options: nameOrOptions ?? {}
    }
  }
}

export function getArrayFromOverloadedRest<T>(overloadedArray: Array<T | readonly T[]>): T[] {
  let items: T[]
  if (Array.isArray(overloadedArray[0])) {
    items = overloadedArray[0] as T[]
  } else {
    items = overloadedArray as T[]
  }
  return items
}
