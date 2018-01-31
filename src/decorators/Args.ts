import { MetadataStorage } from "../metadata/metadata-storage";
import { getParamInfo } from "../helpers/params";

export function Args(): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    MetadataStorage.registerHandlerParam({
      kind: "args",
      ...getParamInfo(prototype, propertyKey, parameterIndex),
    });
  };
}
