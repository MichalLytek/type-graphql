import { MetadataStorage } from "../metadata/metadata-storage";

export function GraphQLArgumentType(name?: string): ClassDecorator {
  return target => {
    MetadataStorage.registerArgsDefinition({
      name: name || target.name,
      target,
    });
  };
}
