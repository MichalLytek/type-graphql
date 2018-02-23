import { MetadataStorage } from "../metadata/metadata-storage";
import { ClassType, ClassTypeResolver } from "../types/decorators";

export function GraphQLResolver(typeFunc: ClassTypeResolver): ClassDecorator;
export function GraphQLResolver(objectType: ClassType): ClassDecorator;
export function GraphQLResolver(objectTypeOrTypeFunc: Function): ClassDecorator {
  const getParentType = objectTypeOrTypeFunc.prototype
    ? () => objectTypeOrTypeFunc as ClassType
    : (objectTypeOrTypeFunc as ClassTypeResolver);

  return target => {
    MetadataStorage.registerResolver({
      target,
      getParentType,
    });
  };
}
