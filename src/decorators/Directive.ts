import { MethodAndPropDecorator } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { DirectiveMetadata } from "../metadata/definitions/directive-metadata";

export interface DirectiveArgs {
  [arg: string]: any;
}

export function Directive(sdl: string): MethodAndPropDecorator & ClassDecorator;
export function Directive(
  name: DirectiveMetadata["nameOrSDL"],
  args?: DirectiveMetadata["args"],
): MethodAndPropDecorator & ClassDecorator;
export function Directive(
  nameOrSDL: string,
  args?: DirectiveArgs,
): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (targetOrPrototype, propertyKey, descriptor) => {
    const directive = { nameOrSDL, args: args || {} };

    if (!propertyKey) {
      getMetadataStorage().collectDirectiveClassMetadata({
        target: targetOrPrototype as Function,
        directive,
      });

      return;
    }

    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectDirectiveFieldMetadata({
      target: targetOrPrototype.constructor,
      field: propertyKey,
      directive,
    });
  };
}
