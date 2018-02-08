import { HandlerDefinition } from "../metadata/definition-interfaces";
import { ReturnTypeFunc, AdvancedOptions } from "../types/decorators";
import { findType } from "./findType";

export function getHandlerInfo(
  prototype: object,
  propertyKey: string | symbol,
  returnTypeFunc?: ReturnTypeFunc,
  options: AdvancedOptions = {},
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
    handler: (prototype as any)[methodName],
    target: prototype.constructor,
    getReturnType: getType,
    returnTypeOptions: typeOptions,
    description: options.description,
    deprecationReason: options.deprecationReason,
  };
}
