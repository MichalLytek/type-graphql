import { getTypeDecoratorParams } from "@/helpers/decorators";
import { getParamInfo } from "@/helpers/params";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import {
  DecoratorTypeOptions,
  DeprecationOptions,
  DescriptionOptions,
  ReturnTypeFunc,
  ValidateOptions,
} from "./types";

export type ArgOptions = DecoratorTypeOptions &
  DescriptionOptions &
  ValidateOptions &
  DeprecationOptions;

export function Arg(name: string, options?: ArgOptions): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFunc: ReturnTypeFunc,
  options?: ArgOptions,
): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFuncOrOptions?: ReturnTypeFunc | ArgOptions,
  maybeOptions?: ArgOptions,
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
      deprecationReason: options.deprecationReason,
      ...getParamInfo({
        prototype,
        propertyKey,
        parameterIndex,
        returnTypeFunc,
        options,
        argName: name,
      }),
    });
  };
}
