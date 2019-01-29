import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { ReturnTypeFunc, AdvancedOptions, MethodAndPropDecorator, TransformModel } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";
import { TypeOptions } from "class-transformer";

export function Destination(options?: TransformModel): MethodAndPropDecorator;
export function Destination(options?: TransformModel): MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    const opts = options || {};
    getMetadataStorage().collectDestinationMetadata({
      name: propertyKey,
      target: prototype.constructor,
      ...opts,
    });
  };
}
