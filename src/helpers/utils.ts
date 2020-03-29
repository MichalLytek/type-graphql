export type ArrayElements<TArray extends ReadonlyArray<any>> = TArray extends ReadonlyArray<
  infer TElement
>
  ? TElement
  : never;

export type UnionFromClasses<TClassesArray extends ReadonlyArray<any>> = InstanceType<
  ArrayElements<TClassesArray>
>;
