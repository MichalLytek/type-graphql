import { MetadataStorage } from "../metadata/metadata-storage";
import { getParamInfo } from "../helpers/params";
import { ValidateOptions } from "../types/decorators";

export function Args(options: ValidateOptions = {}): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    MetadataStorage.collectHandlerParamMetadata({
      kind: "args",
      ...getParamInfo({ prototype, propertyKey, parameterIndex, options }),
    });
  };
}
