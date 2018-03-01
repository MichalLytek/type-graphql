import { MetadataStorage } from "../metadata/metadata-storage";
import { ClassType, ClassTypeResolver } from "../types/decorators";

export function GraphQLResolver(typeFunc: ClassTypeResolver): ClassDecorator;
export function GraphQLResolver(objectType: ClassType): ClassDecorator;
export function GraphQLResolver(): ClassDecorator;
export function GraphQLResolver(objectTypeOrTypeFunc?: Function): ClassDecorator {
  return target => {
    const getParentType = objectTypeOrTypeFunc
      ? objectTypeOrTypeFunc.prototype
        ? () => objectTypeOrTypeFunc as ClassType
        : (objectTypeOrTypeFunc as ClassTypeResolver)
      : () => {
          throw new Error(
            `No provided object type in '@GraphQLResolver' decorator for class '${target.name}!'`,
          );
        };
    MetadataStorage.registerResolver({
      target,
      getParentType,
    });
  };
}
