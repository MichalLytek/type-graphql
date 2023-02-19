import { getTypeDecoratorParams } from "@/helpers/decorators";
import { getResolverMetadata } from "@/helpers/resolver-metadata";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { AdvancedOptions, ReturnTypeFunc } from "./types";

export function Query(): MethodDecorator;
export function Query(options: AdvancedOptions): MethodDecorator;
export function Query(returnTypeFunc: ReturnTypeFunc, options?: AdvancedOptions): MethodDecorator;
export function Query(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const metadata = getResolverMetadata(prototype, methodName, returnTypeFunc, options);
    getMetadataStorage().collectQueryHandlerMetadata(metadata);
  };
}
