import { GraphQLScalarType } from "graphql";
import { ValidatorOptions } from "class-validator";

import { findType } from "./findType";
import { ReturnTypeFunc, ClassType, TypeOptions, ValidateOptions } from "../types/decorators";
import { CommonArgDefinition } from "../metadata/definition-interfaces";

export interface ParamInfo {
  prototype: Object;
  propertyKey: string | symbol;
  parameterIndex: number;
  returnTypeFunc?: ReturnTypeFunc;
  options?: TypeOptions & ValidateOptions;
}
export function getParamInfo({
  prototype,
  propertyKey,
  parameterIndex,
  returnTypeFunc,
  options = {},
}: ParamInfo): CommonArgDefinition {
  if (typeof propertyKey === "symbol") {
    throw new Error("Symbol keys are not supported yet!");
  }

  const { getType, typeOptions } = findType({
    metadataKey: "design:paramtypes",
    prototype,
    propertyKey,
    parameterIndex,
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
