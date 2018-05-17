import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getParamInfo } from "../helpers/params";
import { ValidateOptions } from "./types";

export function Args(options: ValidateOptions = {}): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    getMetadataStorage().collectHandlerParamMetadata({
      kind: "args",
      ...getParamInfo({ prototype, propertyKey, parameterIndex, options }),
    });
  };
}
