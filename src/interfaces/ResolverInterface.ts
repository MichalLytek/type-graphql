export const MappedType = Symbol("MappedType");

export type Mapped<T> = T extends { [MappedType]: infer M }
  ? M
  : T extends Array<{ [MappedType]: infer N }>
  ? N[]
  : T;

/**
 * Resolver classes can implement this type
 * to provide a proper resolver method signatures for fields of T.
 */
export type ResolverInterface<T extends object> = {
  [P in keyof T]?: (root: Mapped<T>, ...args: any[]) => Mapped<T[P]> | Promise<Mapped<T[P]>>;
};
