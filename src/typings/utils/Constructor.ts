// Copied from 'type-fest' (https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts)

/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
*/
export type Constructor<T extends object, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;
