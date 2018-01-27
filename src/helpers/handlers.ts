import { HandlerDefinition } from "../metadata/definition-interfaces";
import { ReturnTypeFunc, TypeOptions, ClassType } from "../types";
import { getType } from "./getType";

export function getHandlerInfo<T extends Object>(
  prototype: T,
  propertyKey: string | symbol,
  returnTypeOrFunc?: ReturnTypeFunc | ClassType,
  options: TypeOptions = {},
): HandlerDefinition {
  if (typeof propertyKey === "symbol") {
    throw new Error("Symbol keys are not supported yet!");
  }

  const returnType = getType({
    metadataKey: "design:returntype",
    prototype,
    propertyKey,
    returnTypeOrFunc,
    typeOptions: options,
  });

  const methodName = propertyKey as keyof typeof prototype;

  return {
    methodName,
    handler: prototype[methodName],
    target: prototype.constructor,
    returnType,
    returnTypeOptions: options,
  };
}
