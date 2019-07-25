import { MethodAndPropDecorator } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export function Directive(sdl: string): MethodAndPropDecorator & ClassDecorator;
export function Directive(
  name: string,
  args?: Record<string, any>,
): MethodAndPropDecorator & ClassDecorator;
export function Directive(
  nameOrDefinition: string,
  args?: Record<string, any>,
): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (targetOrPrototype, propertyKey, descriptor) => {
    const directive = { nameOrDefinition, args: args || {} };

    if (!propertyKey) {
      getMetadataStorage().collectDirectiveClassMetadata({
        target: targetOrPrototype as Function,
        directive,
      });
    } else {
      if (typeof propertyKey === "symbol") {
        throw new SymbolKeysNotSupportedError();
      }

      getMetadataStorage().collectDirectiveFieldMetadata({
        target: targetOrPrototype.constructor,
        field: propertyKey,
        directive,
      });
    }
  };
}
