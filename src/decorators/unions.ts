import type { UnionFromClasses } from "@/helpers/utils";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import type { ClassType } from "@/typings";
import type { ResolveTypeOptions } from "./types";

export interface UnionTypeConfig<TClassTypes extends readonly ClassType[]>
  extends ResolveTypeOptions<UnionFromClasses<TClassTypes>> {
  name: string;
  description?: string;
  types: () => TClassTypes;
}

export function createUnionType<T extends readonly ClassType[]>(
  config: UnionTypeConfig<T>,
): UnionFromClasses<T>;
export function createUnionType({
  name,
  description,
  types,
  resolveType,
}: UnionTypeConfig<ClassType[]>): any {
  const unionMetadataSymbol = getMetadataStorage().collectUnionMetadata({
    name,
    description,
    getClassTypes: types,
    resolveType,
  });
  return unionMetadataSymbol;
}
