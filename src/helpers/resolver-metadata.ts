import { ResolverMetadata } from '../metadata/definitions'
import { AdvancedOptions, ReturnTypeFunc } from '../decorators/types'
import { findType } from './findType'
import { SymbolKeysNotSupportedError } from '../errors'

export function getResolverMetadata(
  prototype: object,
  propertyKey: string | symbol,
  returnTypeFunc?: ReturnTypeFunc,
  options: AdvancedOptions = {}
): ResolverMetadata {
  if (typeof propertyKey === 'symbol') {
    throw new SymbolKeysNotSupportedError()
  }

  const { getType, typeOptions } = findType({
    metadataKey: 'design:returntype',
    prototype,
    propertyKey,
    returnTypeFunc,
    typeOptions: options
  })

  const methodName = propertyKey as keyof typeof prototype

  return {
    methodName,
    schemaName: options.name ?? methodName,
    target: prototype.constructor,
    getReturnType: getType,
    returnTypeOptions: typeOptions,
    description: options.description,
    deprecationReason: options.deprecationReason,
    complexity: options.complexity
  }
}
