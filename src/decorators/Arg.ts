import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, BasicOptions } from "../types/decorators";
import { getParamInfo } from "../helpers/params";
import { getTypeDecoratorParams } from "../helpers/decorators";

export function Arg(name: string, BasicOptions?: BasicOptions): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFunc: ReturnTypeFunc,
  BasicOptions?: BasicOptions,
): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFuncOrOptions?: ReturnTypeFunc | BasicOptions,
  maybeOptions?: BasicOptions,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    const { options, returnTypeFunc } = getTypeDecoratorParams(
      returnTypeFuncOrOptions,
      maybeOptions,
    );
    MetadataStorage.registerHandlerParam({
      kind: "arg",
      name,
      description: options.description,
      ...getParamInfo(prototype, propertyKey, parameterIndex, returnTypeFunc, options),
    });
  };
}
