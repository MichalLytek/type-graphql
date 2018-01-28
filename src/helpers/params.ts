import { MetadataStorage } from "../metadata/metadata-storage";
import { findType } from "./findType";
import { ReturnTypeFunc, ClassType } from "../types";
import { ParamDefinition } from "../metadata/definition-interfaces";

export function getParamInfo(
  prototype: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
  returnTypeFunc?: ReturnTypeFunc,
) {
  if (typeof propertyKey === "symbol") {
    throw new Error("Symbol keys are not supported yet!");
  }

  const { getType } = findType({
    metadataKey: "design:paramtypes",
    prototype,
    propertyKey,
    parameterIndex,
    returnTypeFunc,
  });

  return {
    target: prototype.constructor,
    methodName: propertyKey,
    index: parameterIndex,
    getType,
  };
}
