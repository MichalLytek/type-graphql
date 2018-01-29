import { MetadataStorage } from "../metadata/metadata-storage";

export function GraphQLResolver(typeFunc: () => any): ClassDecorator {
  return target => {
    MetadataStorage.registerResolver({
      target,
      getParentType: typeFunc,
    });
  };
}
