import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, AdvancedOptions, TypeValueThunk, TypeOptions } from "../types/decorators";
import { SymbolKeysNotSupportedError } from "../errors";
import { getTypeDecoratorParams } from "../helpers/decorators";
import { findType } from "../helpers/findType";

export function FieldResolver(options?: AdvancedOptions): MethodDecorator;
export function FieldResolver(
  returnTypeFunction?: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function FieldResolver(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  return (prototype, propertyKey) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    let getType: TypeValueThunk | undefined;
    let typeOptions: TypeOptions | undefined;

    const { options, returnTypeFunc } = getTypeDecoratorParams(
      returnTypeFuncOrOptions,
      maybeOptions,
    );

    // try to get return type info
    try {
      const typeInfo = findType({
        metadataKey: "design:returntype",
        prototype,
        propertyKey,
        returnTypeFunc,
        typeOptions: options,
      });
      typeOptions = typeInfo.typeOptions;
      getType = typeInfo.getType;
    // tslint:disable-next-line:no-empty
    } catch {}

    MetadataStorage.collectFieldResolverMetadata({
      kind: "external",
      methodName: propertyKey,
      target: prototype.constructor,
      handler: (prototype as any)[propertyKey],
      getType,
      typeOptions,
      description: options.description,
      deprecationReason: options.deprecationReason,
    });
  };
}
