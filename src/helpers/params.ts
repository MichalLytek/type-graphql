import { MetadataStorage } from "../metadata/metadata-storage";
import { getType } from "./getType";
import { ReturnTypeFunc, ClassType } from "../types";
import { ParamDefinition } from "../metadata/definition-interfaces";

export function getParamInfo(
  prototype: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
  returnTypeOrFunc?: ReturnTypeFunc | ClassType,
) {
  if (typeof propertyKey === "symbol") {
    throw new Error("Symbol keys are not supported yet!");
  }

  const { type } = getType({
    metadataKey: "design:paramtypes",
    prototype,
    propertyKey,
    parameterIndex,
    returnTypeOrFunc,
  });

  return {
    target: prototype.constructor,
    methodName: propertyKey,
    index: parameterIndex,
    type,
  };
}
