import { MetadataStorage } from "../metadata/metadata-storage";
import { ClassType, ClassTypeResolver } from "../types/decorators";

export function Resolver(typeFunc: ClassTypeResolver): ClassDecorator;
export function Resolver(objectType: ClassType): ClassDecorator;
export function Resolver(): ClassDecorator;
export function Resolver(objectTypeOrTypeFunc?: Function): ClassDecorator {
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
    MetadataStorage.collectResolverClassMetadata({
      target,
      getObjectType,
    });
  };
}
