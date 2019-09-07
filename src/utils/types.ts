// `Without` and `MergeExclusive` copied from `sindresorhus/type-fest`
// https://github.com/sindresorhus/type-fest/blob/c6a3d8c2603e9d6b8f20edb0157faae15548cd5b/source/merge-exclusive.d.ts

export type Without<FirstType, SecondType> = {
  [KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never;
};

export type MergeExclusive<FirstType, SecondType> = (FirstType | SecondType) extends object
  ? (Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType)
  : FirstType | SecondType;

export type NonEmptyArray<TItem> = [TItem, ...TItem[]];
