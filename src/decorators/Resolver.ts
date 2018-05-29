import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { ClassType, ClassTypeResolver, ResolverClassOptions } from "./types";

export function Resolver(): ClassDecorator;
export function Resolver(options: ResolverClassOptions): ClassDecorator;
export function Resolver(
  typeFunc: ClassTypeResolver,
  options?: ResolverClassOptions,
): ClassDecorator;
export function Resolver(objectType: ClassType, options?: ResolverClassOptions): ClassDecorator;
export function Resolver(
  objectTypeOrTypeFuncOrMaybeOptions?: Function | ResolverClassOptions,
  maybeOptions?: ResolverClassOptions,
): ClassDecorator {
  const objectTypeOrTypeFunc: Function | undefined =
    typeof objectTypeOrTypeFuncOrMaybeOptions === "function"
      ? objectTypeOrTypeFuncOrMaybeOptions
      : undefined;
  const options: ResolverClassOptions =
    (typeof objectTypeOrTypeFuncOrMaybeOptions === "function"
      ? maybeOptions
      : objectTypeOrTypeFuncOrMaybeOptions) || {};

  return target => {
    const getObjectType = objectTypeOrTypeFunc
      ? objectTypeOrTypeFunc.prototype
        ? () => objectTypeOrTypeFunc as ClassType
        : (objectTypeOrTypeFunc as ClassTypeResolver)
      : () => {
          throw new Error(
            `No provided object type in '@Resolver' decorator for class '${target.name}!'`,
          );
        };
    getMetadataStorage().collectResolverClassMetadata({
      target,
      getObjectType,
      isAbstract: options.isAbstract,
    });
  };
}
