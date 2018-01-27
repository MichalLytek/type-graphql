import { MetadataStorage } from "../metadata/metadata-storage";
import { getType } from "../helpers/getType";
import { ReturnTypeFunc, ClassType } from "../types";
import { getParamInfo } from "../helpers/params";

export function Arg(
  name: string,
  returnTypeOrFunc?: ReturnTypeFunc | ClassType,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    MetadataStorage.registerHandlerParam({
      kind: "arg",
      name,
      ...getParamInfo(prototype, propertyKey, parameterIndex, returnTypeOrFunc),
    });
  };
}
