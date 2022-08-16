import { ResolverData } from "../interfaces";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { InvalidParamDecoratorError, SymbolKeysNotSupportedError } from "../errors";
import { ArgOptions } from "./Arg";
import { CustomParamOptions } from "../metadata/definitions";
import { getParamInfo } from "../helpers/params";
import { ReturnTypeFunc } from "./types";

export type ParamOptions = {
  arg?: {
    name: string;
    returnTypeFunc: ReturnTypeFunc;
    options?: ArgOptions;
  };
};

export type ParamResolver<TContextType = {}> = (resolverData: ResolverData<TContextType>) => any;

export function createParamDecorator<TContextType = {}>(
  resolver: ParamResolver<TContextType>,
): ParameterDecorator;

export function createParamDecorator<TContextType = {}>(
  options: ParamOptions,
  resolver: ParamResolver<TContextType>,
): ParameterDecorator;

export function createParamDecorator<TContextType = {}>(
  optionsOrResolver: ParamOptions | ParamResolver<TContextType>,
  maybeResolver?: ParamResolver<TContextType>,
): ParameterDecorator {
  let paramOptions: ParamOptions;
  let resolver: ParamResolver<TContextType>;

  if (maybeResolver && typeof optionsOrResolver !== "function") {
    resolver = maybeResolver;
    paramOptions = optionsOrResolver;
  } else if (typeof optionsOrResolver === "function") {
    resolver = optionsOrResolver;
    paramOptions = {};
  } else {
    throw new InvalidParamDecoratorError();
  }

  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    const options: CustomParamOptions = {};

    if (paramOptions.arg) {
      const { arg } = paramOptions;
      options.arg = {
        kind: "arg",
        name: arg.name,
        description: arg.options?.description,
        deprecationReason: arg.options?.deprecationReason,
        ...getParamInfo({
          prototype,
          propertyKey,
          parameterIndex,
          returnTypeFunc: arg.returnTypeFunc,
          options: arg.options,
          argName: arg.name,
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
