import { ClassType } from "@/interfaces";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { ClassTypeResolver } from "./types";

export function Resolver(): ClassDecorator;
export function Resolver(typeFunc: ClassTypeResolver): ClassDecorator;
export function Resolver(objectType: ClassType): ClassDecorator;
export function Resolver(objectTypeOrTypeFunc?: Function): ClassDecorator {
  return target => {
    // eslint-disable-next-line no-nested-ternary
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
    });
  };
}
