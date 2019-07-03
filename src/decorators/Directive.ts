import { MethodAndPropDecorator } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export interface DirectiveArgs {
  [arg: string]: any;
}

export function Directive(
  name: string,
  args?: DirectiveArgs,
): MethodAndPropDecorator & ClassDecorator;
export function Directive(
  name: string,
  args?: DirectiveArgs,
): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (targetOrPrototype, propertyKey, descriptor) => {
    if (!propertyKey) {
      getMetadataStorage().collectDirectiveClassMetadata({
        target: targetOrPrototype as Function,
        name,
        args,
      });

      return;
    }

    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectDirectiveFieldMetadata({
      target: targetOrPrototype.constructor,
      field: propertyKey,
      name,
      args,
    });
  };
}
