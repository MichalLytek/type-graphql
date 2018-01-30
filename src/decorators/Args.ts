import { MetadataStorage } from "../metadata/metadata-storage";
import { findType } from "../helpers/findType";
import { ReturnTypeFunc, ClassType } from "../types";
import { getParamInfo } from "../helpers/params";

export function Args(): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    MetadataStorage.registerHandlerParam({
      kind: "args",
      ...getParamInfo(prototype, propertyKey, parameterIndex),
    });
  };
}
