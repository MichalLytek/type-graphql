import { ClassType } from "../interfaces";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { UnionFromClasses } from "../helpers/utils";
import { ResolveTypeOptions } from "./types";

export interface UnionTypeConfig<TClassTypes extends ClassType[]>
  extends ResolveTypeOptions<UnionFromClasses<TClassTypes>> {
  name: string;
  description?: string;
  /**
   * The direct array syntax is deprecated.
   * Use the function syntax `() => TClassTypes` instead.
   */
  types: TClassTypes | (() => TClassTypes);
}

export function createUnionType<T extends ClassType[]>(
  config: UnionTypeConfig<T>,
): UnionFromClasses<T>;
export function createUnionType({
  name,
  description,
  types: classTypesOrClassTypesFn,
  resolveType,
}: UnionTypeConfig<ClassType[]>): any {
  const unionMetadataSymbol = getMetadataStorage().collectUnionMetadata({
    name,
    description,
    getClassTypes:
      typeof classTypesOrClassTypesFn === "function"
        ? classTypesOrClassTypesFn
        : () => classTypesOrClassTypesFn,
    resolveType,
  });
  return unionMetadataSymbol;
}
