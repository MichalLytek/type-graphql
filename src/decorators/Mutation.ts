import { ReturnTypeFunc, TypeOptions } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";

export function Mutation(
  returnTypeFunc?: ReturnTypeFunc,
  options: TypeOptions = {},
): MethodDecorator {
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    MetadataStorage.registerMutationHandler(handler);
  };
}
