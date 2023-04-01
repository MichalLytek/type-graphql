import { getTypeDecoratorParams } from "@/helpers/decorators";
import { getResolverMetadata } from "@/helpers/resolver-metadata";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import type { AdvancedOptions, ReturnTypeFunc } from "./types";

export function Mutation(): MethodDecorator;
export function Mutation(options: AdvancedOptions): MethodDecorator;
export function Mutation(
  returnTypeFunc: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function Mutation(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const metadata = getResolverMetadata(prototype, methodName, returnTypeFunc, options);
    getMetadataStorage().collectMutationHandlerMetadata(metadata);
  };
}
