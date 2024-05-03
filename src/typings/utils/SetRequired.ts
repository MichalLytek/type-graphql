// Copied from 'type-fest' (https://github.com/sindresorhus/type-fest/blob/main/source/set-required.d.ts)

import { type Except } from "./Except";
import { type Simplify } from "./Simplify";

/**
Create a type that makes the given keys required. The remaining keys are kept as is. The sister of the `SetOptional` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.

@example
```
import {SetRequired} from 'type-fest';

type Foo = {
	a?: number;
	b: string;
	c?: boolean;
}

type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
// type SomeRequired = {
// 	a?: number;
// 	b: string; // Was already required and still is.
// 	c: boolean; // Is now required.
// }
```
*/
export type SetRequired<BaseType, Keys extends keyof BaseType> = Simplify<
  // Pick just the keys that are optional from the base type.
  Except<BaseType, Keys> &
    // Pick the keys that should be required from the base type and make them required.
    Required<Pick<BaseType, Keys>>
>;
