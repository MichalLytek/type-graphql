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
  args: Record<string, any> = {},
): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (targetOrPrototype, propertyKey, descriptor) => {
    const directive = { nameOrDefinition, args };

    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    if (propertyKey) {
      getMetadataStorage().collectDirectiveFieldMetadata({
        target: targetOrPrototype.constructor,
        fieldName: propertyKey,
        directive,
      });
    } else {
      getMetadataStorage().collectDirectiveClassMetadata({
        target: targetOrPrototype as Function,
        directive,
      });
    }
  };
}
