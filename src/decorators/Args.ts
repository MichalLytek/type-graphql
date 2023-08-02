import { getTypeDecoratorParams } from "@/helpers/decorators";
import { getParamInfo } from "@/helpers/params";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type ParameterDecorator } from "@/typings";
import { type ReturnTypeFunc, type ValidateOptions } from "./types";

export function Args(): ParameterDecorator;
export function Args(options: ValidateOptions): ParameterDecorator;
export function Args(
  paramTypeFunction: ReturnTypeFunc,
  options?: ValidateOptions,
): ParameterDecorator;
export function Args(
  paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions,
  maybeOptions?: ValidateOptions,
): ParameterDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
  return (prototype, propertyKey, parameterIndex) => {
    getMetadataStorage().collectHandlerParamMetadata({
      kind: "args",
      ...getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options }),
    });
  };
}
