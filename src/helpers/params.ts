import { ReturnTypeFunc, TypeOptions, ValidateOptions } from "@/decorators/types";
import { SymbolKeysNotSupportedError } from "@/errors";
import { CommonArgMetadata } from "@/metadata/definitions";
import { findType } from "./findType";

export interface ParamInfo {
  prototype: Object;
  propertyKey: string | symbol;
  parameterIndex: number;
  argName?: string;
  returnTypeFunc?: ReturnTypeFunc;
  options?: TypeOptions & ValidateOptions;
}
export function getParamInfo({
  prototype,
  propertyKey,
  parameterIndex,
  argName,
  returnTypeFunc,
  options = {},
}: ParamInfo): CommonArgMetadata {
  if (typeof propertyKey === "symbol") {
    throw new SymbolKeysNotSupportedError();
  }

  const { getType, typeOptions } = findType({
    metadataKey: "design:paramtypes",
    prototype,
    propertyKey,
    parameterIndex,
    argName,
    returnTypeFunc,
    typeOptions: options,
  });

  return {
    target: prototype.constructor,
    methodName: propertyKey,
    index: parameterIndex,
    getType,
    typeOptions,
    validate: options.validate,
  };
}
