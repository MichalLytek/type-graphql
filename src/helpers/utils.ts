export type ArrayElements<TArray extends any[]> = TArray extends Array<infer TElement>
  ? TElement
  : never;

export type UnionFromClasses<TClassesArray extends any[]> = InstanceType<
  ArrayElements<TClassesArray>
>;
