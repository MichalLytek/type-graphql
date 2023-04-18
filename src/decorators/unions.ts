import type { UnionFromClasses } from "@/helpers/utils";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import type { Class } from "@/typings";
import type { ResolveTypeOptions } from "./types";

export interface UnionTypeConfig<TClassTypes extends readonly Class[]>
  extends ResolveTypeOptions<UnionFromClasses<TClassTypes>> {
  name: string;
  description?: string;
  types: () => TClassTypes;
}

export function createUnionType<T extends readonly Class[]>(
  config: UnionTypeConfig<T>,
): UnionFromClasses<T>;
export function createUnionType({
  name,
  description,
  types,
  resolveType,
}: UnionTypeConfig<Class[]>): any {
  const unionMetadataSymbol = getMetadataStorage().collectUnionMetadata({
    name,
    description,
    getClassTypes: types,
    resolveType,
  });
  return unionMetadataSymbol;
}
