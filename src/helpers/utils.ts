export type ArrayElements<TArray extends readonly any[]> =
  TArray extends readonly (infer TElement)[] ? TElement : never;

export type UnionFromClasses<TClassesArray extends readonly any[]> = InstanceType<
  ArrayElements<TClassesArray>
>;
