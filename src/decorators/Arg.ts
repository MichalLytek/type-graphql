import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, ClassType } from "../types";
import { getParamInfo } from "../helpers/params";

export function Arg(
  name: string,
  returnTypeFunc?: ReturnTypeFunc,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    MetadataStorage.registerHandlerParam({
      kind: "arg",
      name,
      ...getParamInfo(prototype, propertyKey, parameterIndex, returnTypeFunc),
    });
  };
}
