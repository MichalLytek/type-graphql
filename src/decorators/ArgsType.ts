import { MetadataStorage } from "../metadata/metadata-storage";

export function ArgsType(name?: string): ClassDecorator {
  return target => {
    MetadataStorage.registerArgsDefinition({
      name: name || target.name,
      target,
    });
  };
}
