import { ClassType } from "../interfaces";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { InstanceSideOfClass, ArrayElementTypes } from "../helpers/utils";

export interface UnionTypeConfig<ObjectTypes extends ClassType[]> {
  name: string;
  description?: string;
  types: ObjectTypes;
}

export type UnionFromClasses<T extends any[]> = InstanceSideOfClass<ArrayElementTypes<T>>;

export function createUnionType<T extends ClassType[]>({
  types,
  name,
  description,
}: UnionTypeConfig<T>): UnionFromClasses<T>;
export function createUnionType({ types, name, description }: UnionTypeConfig<ClassType[]>): any {
  const unionMetadataSymbol = getMetadataStorage().collectUnionMetadata({
    types,
    name,
    description,
  });

  return unionMetadataSymbol;
}
