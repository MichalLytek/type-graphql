import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { ReturnTypeFunc, AdvancedOptions, MethodAndPropDecorator } from "./types";
import { findType } from "../helpers/findType";
import { getTypeDecoratorParams } from "../helpers/decorators";
import { SymbolKeysNotSupportedError } from "../errors";

export function Field(): MethodAndPropDecorator;
export function Field(options: AdvancedOptions): MethodAndPropDecorator;
export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodAndPropDecorator;
export function Field(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    const { options, returnTypeFunc } = getTypeDecoratorParams(
      returnTypeFuncOrOptions,
      maybeOptions,
    );
    const isResolver = Boolean(descriptor);
    const isResolverMethod = Boolean(descriptor && descriptor.value);

    const { getType, typeOptions } = findType({
      metadataKey: isResolverMethod ? "design:returntype" : "design:type",
      prototype,
      propertyKey,
      returnTypeFunc,
      typeOptions: options,
    });

    getMetadataStorage().collectClassFieldMetadata({
      name: propertyKey,
      schemaName: options.name || propertyKey,
      getType,
      typeOptions,
      complexity: options.complexity,
      target: prototype.constructor,
      description: options.description,
      deprecationReason: options.deprecationReason,
    });

    if (isResolver) {
      getMetadataStorage().collectFieldResolverMetadata({
        kind: "internal",
        methodName: propertyKey,
        schemaName: options.name || propertyKey,
        target: prototype.constructor,
        handler: isResolverMethod ? (prototype as any)[propertyKey] : undefined,
        complexity: options.complexity,
      });
    }
  };
}
