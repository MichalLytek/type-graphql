import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { SymbolKeysNotSupportedError } from "@/errors";
import { getTypeDecoratorParams } from "@/helpers/decorators";
import { findType } from "@/helpers/findType";
import { ReturnTypeFunc, AdvancedOptions, TypeValueThunk, TypeOptions } from "./types";

export function FieldResolver(): MethodDecorator;
export function FieldResolver(options: AdvancedOptions): MethodDecorator;
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
    } catch {
      // tslint:disable-next-line:no-empty
    }

    getMetadataStorage().collectFieldResolverMetadata({
      kind: "external",
      methodName: propertyKey,
      schemaName: options.name || propertyKey,
      target: prototype.constructor,
      getType,
      typeOptions,
      complexity: options.complexity,
      description: options.description,
      deprecationReason: options.deprecationReason,
    });
  };
}
