import { MetadataStorage } from "../metadata/metadata-storage";

export function GraphQLResolver(type: any): ClassDecorator {
  return target => {
    MetadataStorage.registerResolver({
      target,
      parentType: type,
    });
  };
}
