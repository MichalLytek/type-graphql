import { ClassType } from '../interfaces'
import { getMetadataStorage } from '../metadata/getMetadataStorage'
import { UnionFromClasses } from '../helpers/utils'
import { ResolveTypeOptions } from './types'

export interface UnionTypeConfig<TClassTypes extends readonly ClassType[]>
  extends ResolveTypeOptions<UnionFromClasses<TClassTypes>> {
  name: string
  description?: string
  types: () => TClassTypes
}

export function createUnionType<T extends readonly ClassType[]>(config: UnionTypeConfig<T>): UnionFromClasses<T>
export function createUnionType({ name, description, types, resolveType }: UnionTypeConfig<ClassType[]>): any {
  const unionMetadataSymbol = getMetadataStorage().collectUnionMetadata({
    name,
    description,
    getClassTypes: types,
    resolveType
  })
  return unionMetadataSymbol
}
