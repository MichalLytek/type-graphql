// Copied from 'type-fest' (https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts)

import type { Constructor } from "./Constructor";

/**
Matches a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
*/
export type Class<T = unknown, Arguments extends unknown[] = any[]> = Constructor<T, Arguments> & {
  prototype: T;
};
