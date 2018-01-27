import { MetadataStorage } from "../metadata/metadata-storage";

export function GraphQLInputType(name?: string): ClassDecorator {
  return target => {
    MetadataStorage.registerInputDefinition({
      name: name || target.name,
      target,
    });
  };
}
