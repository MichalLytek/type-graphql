import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import type { Class } from "@/typings";
import type { ClassTypeResolver } from "./types";

export function Resolver(): ClassDecorator;
export function Resolver(typeFunc: ClassTypeResolver): ClassDecorator;
export function Resolver(objectType: Class): ClassDecorator;
export function Resolver(objectTypeOrTypeFunc?: Function): ClassDecorator {
  return target => {
    // eslint-disable-next-line no-nested-ternary
    const getObjectType = objectTypeOrTypeFunc
      ? objectTypeOrTypeFunc.prototype
        ? () => objectTypeOrTypeFunc as Class
        : (objectTypeOrTypeFunc as ClassTypeResolver)
      : () => {
          throw new Error(
            `No provided object type in '@Resolver' decorator for class '${target.name}!'`,
          );
        };
    getMetadataStorage().collectResolverClassMetadata({
      target,
      getObjectType,
    });
  };
}
