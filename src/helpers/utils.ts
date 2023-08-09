export type ArrayElements<TArray extends readonly any[]> = TArray extends ReadonlyArray<
  infer TElement
>
  ? TElement
  : never;

export type UnionFromClasses<TClassesArray extends readonly any[]> = InstanceType<
  ArrayElements<TClassesArray>
>;
