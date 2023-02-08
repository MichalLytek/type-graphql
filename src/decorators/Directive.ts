import { SymbolKeysNotSupportedError } from "~/errors";
import { getMetadataStorage } from "~/metadata/getMetadataStorage";
import { MethodAndPropDecorator } from "./types";

export function Directive(sdl: string): MethodAndPropDecorator & ClassDecorator;
export function Directive(
  nameOrDefinition: string,
): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (targetOrPrototype, propertyKey, _descriptor) => {
    const directive = { nameOrDefinition, args: {} };

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
