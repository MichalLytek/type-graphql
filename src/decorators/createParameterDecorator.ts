import { SymbolKeysNotSupportedError } from "@/errors";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type ParameterDecorator, type ResolverData } from "@/typings";
import { type ArgOptions } from "./Arg";
import { type ReturnTypeFunc } from "./types";
import { getParamInfo } from "../helpers/params";
import { type CustomParamOptions } from "../metadata/definitions";

export interface CustomParameterOptions {
  arg?: {
    name: string;
    typeFunc: ReturnTypeFunc;
    options?: ArgOptions;
  };
}

export type ParameterResolver<TContextType extends object = object> = (
  resolverData: ResolverData<TContextType>,
) => any;

export function createParameterDecorator<TContextType extends object = object>(
  resolver: ParameterResolver<TContextType>,
  paramOptions: CustomParameterOptions = {},
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    const options: CustomParamOptions = {};
    if (paramOptions.arg) {
      options.arg = {
        kind: "arg",
        name: paramOptions.arg.name,
        description: paramOptions.arg.options?.description,
        deprecationReason: paramOptions.arg.options?.deprecationReason,
        ...getParamInfo({
          prototype,
          propertyKey,
          parameterIndex,
          returnTypeFunc: paramOptions.arg.typeFunc,
          options: paramOptions.arg.options,
          argName: paramOptions.arg.name,
        }),
      };
    }

    getMetadataStorage().collectHandlerParamMetadata({
      kind: "custom",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
      resolver,
      options,
    });
  };
}
