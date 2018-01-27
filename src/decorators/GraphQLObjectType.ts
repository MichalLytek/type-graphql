import { MetadataStorage } from "../metadata/metadata-storage";

export function GraphQLObjectType(name?: string): ClassDecorator {
  return target => {
    MetadataStorage.registerObjectDefinition({
      name: name || target.name,
      target,
    });
  };
}
