import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { MethodAndPropDecorator, DestinationOptions } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";

export function Destination(options?: DestinationOptions): MethodAndPropDecorator;
export function Destination(options?: DestinationOptions): MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    const opts = options || {};
    getMetadataStorage().collectDestinationMetadata({
      name: propertyKey,
      array: opts.array,
      target: prototype.constructor,
      transform: opts.transformModel,
      nullable: opts.nullable,
    });
  };
}
