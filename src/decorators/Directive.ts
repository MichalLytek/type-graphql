import { SymbolKeysNotSupportedError } from "@/errors";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type MethodAndPropDecorator } from "./types";

export function Directive(
  sdl: string,
): MethodAndPropDecorator & ClassDecorator & ParameterDecorator;
export function Directive(
  nameOrDefinition: string,
): MethodDecorator | PropertyDecorator | ClassDecorator | ParameterDecorator {
  return (
    targetOrPrototype: Object,
    propertyKey: string | symbol | undefined,
    parameterIndexOrDescriptor: number | TypedPropertyDescriptor<Object>,
  ) => {
    const directive = { nameOrDefinition, args: {} };

    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    if (propertyKey) {
      if (typeof parameterIndexOrDescriptor === "number") {
        getMetadataStorage().collectDirectiveArgumentMetadata({
          target: targetOrPrototype.constructor,
          fieldName: propertyKey,
          parameterIndex: parameterIndexOrDescriptor,
          directive,
        });
      } else {
        getMetadataStorage().collectDirectiveFieldMetadata({
          target: targetOrPrototype.constructor,
          fieldName: propertyKey,
          directive,
        });
      }
    } else {
      getMetadataStorage().collectDirectiveClassMetadata({
        target: targetOrPrototype as Function,
        directive,
      });
    }
  };
}
