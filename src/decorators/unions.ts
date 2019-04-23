import { ClassType } from "../interfaces";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { UnionFromClasses } from "../helpers/utils";
import { ResolveTypeOptions } from "./types";

export interface UnionTypeConfig<TClassTypes extends ClassType[]>
  extends ResolveTypeOptions<UnionFromClasses<TClassTypes>> {
  name: string;
  description?: string;
  types: TClassTypes;
}

export function createUnionType<T extends ClassType[]>(
  config: UnionTypeConfig<T>,
): UnionFromClasses<T>;
export function createUnionType({
  name,
  description,
  types: classTypes,
  resolveType,
}: UnionTypeConfig<ClassType[]>): any {
  const unionMetadataSymbol = getMetadataStorage().collectUnionMetadata({
    name,
    description,
    classTypes,
    resolveType,
  });
  return unionMetadataSymbol;
}
