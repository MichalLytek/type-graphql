// Copied from 'type-fest' (https://github.com/sindresorhus/type-fest/blob/main/source/set-required.d.ts)

export type NonEmptyArray<T> = readonly [T, ...T[]] | [T, ...T[]];
