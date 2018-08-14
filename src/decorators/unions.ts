import { ClassType } from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export interface UnionTypeConfig<ObjectTypes extends ClassType[]> {
  name: string;
  description?: string;
  types: ObjectTypes;
}

// #region overloads
export function createUnionType<T1, T2>(
  config: UnionTypeConfig<[ClassType<T1>, ClassType<T2>]>,
): T1 | T2;
export function createUnionType<T1, T2, T3>(
  config: UnionTypeConfig<[ClassType<T1>, ClassType<T2>, ClassType<T3>]>,
): T1 | T2 | T3;
export function createUnionType<T1, T2, T3, T4>(
  config: UnionTypeConfig<[ClassType<T1>, ClassType<T2>, ClassType<T3>, ClassType<T4>]>,
): T1 | T2 | T3 | T4;
export function createUnionType<T1, T2, T3, T4, T5>(
  config: UnionTypeConfig<
    [ClassType<T1>, ClassType<T2>, ClassType<T3>, ClassType<T4>, ClassType<T5>]
  >,
): T1 | T2 | T3 | T4 | T5;
export function createUnionType<T1, T2, T3, T4, T5, T6>(
  config: UnionTypeConfig<
    [ClassType<T1>, ClassType<T2>, ClassType<T3>, ClassType<T4>, ClassType<T5>, ClassType<T6>]
  >,
): T1 | T2 | T3 | T4 | T5 | T6;
export function createUnionType<T1, T2, T3, T4, T5, T6, T7>(
  config: UnionTypeConfig<
    [
      ClassType<T1>,
      ClassType<T2>,
      ClassType<T3>,
      ClassType<T4>,
      ClassType<T5>,
      ClassType<T6>,
      ClassType<T7>
    ]
  >,
): T1 | T2 | T3 | T4 | T5 | T6 | T7;
export function createUnionType<T1, T2, T3, T4, T5, T6, T7, T8>(
  config: UnionTypeConfig<
    [
      ClassType<T1>,
      ClassType<T2>,
      ClassType<T3>,
      ClassType<T4>,
      ClassType<T5>,
      ClassType<T6>,
      ClassType<T7>,
      ClassType<T8>
    ]
  >,
): T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8;
export function createUnionType<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  config: UnionTypeConfig<
    [
      ClassType<T1>,
      ClassType<T2>,
      ClassType<T3>,
      ClassType<T4>,
      ClassType<T5>,
      ClassType<T6>,
      ClassType<T7>,
      ClassType<T8>,
      ClassType<T9>
    ]
  >,
): T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9;
export function createUnionType<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  config: UnionTypeConfig<
    [
      ClassType<T1>,
      ClassType<T2>,
      ClassType<T3>,
      ClassType<T4>,
      ClassType<T5>,
      ClassType<T6>,
      ClassType<T7>,
      ClassType<T8>,
      ClassType<T9>,
      ClassType<T10>
    ]
  >,
): T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10;
export function createUnionType({
  types,
  name,
  description,
}: UnionTypeConfig<ClassType[]>): ClassType[];
// #endregion
export function createUnionType({ types, name, description }: UnionTypeConfig<ClassType[]>): any {
  const unionMetadataSymbol = getMetadataStorage().collectUnionMetadata({
    types,
    name,
    description,
  });

  return unionMetadataSymbol;
}
