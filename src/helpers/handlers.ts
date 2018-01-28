import { HandlerDefinition } from "../metadata/definition-interfaces";
import { ReturnTypeFunc, TypeOptions, ClassType } from "../types";
import { findType } from "./findType";

export function getHandlerInfo<T extends Object>(
  prototype: T,
  propertyKey: string | symbol,
  returnTypeFunc?: ReturnTypeFunc,
  options: TypeOptions = {},
): HandlerDefinition {
  if (typeof propertyKey === "symbol") {
    throw new Error("Symbol keys are not supported yet!");
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
    handler: prototype[methodName],
    target: prototype.constructor,
    getReturnType: getType,
    returnTypeOptions: typeOptions,
  };
}
