import type { AdvancedOptions, ReturnTypeFunc } from "@/decorators/types";
import { SymbolKeysNotSupportedError } from "@/errors";
import type { ResolverMetadata } from "@/metadata/definitions";
import { findType } from "./findType";

export function getResolverMetadata(
  prototype: object,
  propertyKey: string | symbol,
  returnTypeFunc?: ReturnTypeFunc,
  options: AdvancedOptions = {},
): ResolverMetadata {
  if (typeof propertyKey === "symbol") {
    throw new SymbolKeysNotSupportedError();
  }

  const { getType, typeOptions } = findType({
    metadataKey: "design:returntype",
    prototype,
    propertyKey,
    returnTypeFunc,
    typeOptions: options,
  });

  const methodName = propertyKey as keyof typeof prototype;

  return {
    methodName,
    schemaName: options.name || methodName,
    target: prototype.constructor,
    getReturnType: getType,
    returnTypeOptions: typeOptions,
    description: options.description,
    deprecationReason: options.deprecationReason,
    complexity: options.complexity,
  };
}
