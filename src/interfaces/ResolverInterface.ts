/**
 * Resolver classes can implement this type
 * to provide a proper resolver method signatures for fields of T.
 */
export type ResolverInterface<T extends object> = {
  [P in keyof T]?: (root: T, ...args: any[]) => T[P] | Promise<T[P]> | null
};
