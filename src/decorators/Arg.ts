import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, ClassType, TypeOptions } from "../types/decorators";
import { getParamInfo } from "../helpers/params";
import { getDecoratorParams } from "../helpers/decorators";

export function Arg(name: string, typeOptions?: TypeOptions): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFunc: ReturnTypeFunc,
  typeOptions?: TypeOptions,
): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFuncOrOptions?: ReturnTypeFunc | TypeOptions,
  maybeOptions?: TypeOptions,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    const { options, returnTypeFunc } = getDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    MetadataStorage.registerHandlerParam({
      kind: "arg",
      name,
      ...getParamInfo(prototype, propertyKey, parameterIndex, returnTypeFunc, options),
    });
  };
}
