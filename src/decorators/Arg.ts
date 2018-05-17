import {
  ReturnTypeFunc,
  DecoratorTypeOptions,
  DescriptionOptions,
  ValidateOptions,
} from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getParamInfo } from "../helpers/params";
import { getTypeDecoratorParams } from "../helpers/decorators";

export type Options = DecoratorTypeOptions & DescriptionOptions & ValidateOptions;

export function Arg(name: string, options?: Options): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFunc: ReturnTypeFunc,
  options?: Options,
): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFuncOrOptions?: ReturnTypeFunc | Options,
  maybeOptions?: Options,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    const { options, returnTypeFunc } = getTypeDecoratorParams(
      returnTypeFuncOrOptions,
      maybeOptions,
    );
    getMetadataStorage().collectHandlerParamMetadata({
      kind: "arg",
      name,
      description: options.description,
      ...getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options }),
    });
  };
}
