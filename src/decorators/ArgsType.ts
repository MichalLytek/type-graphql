import { MetadataStorage } from "../metadata/metadata-storage";

export function ArgsType(name?: string): ClassDecorator {
  return target => {
    MetadataStorage.collectArgsMetadata({
      name: name || target.name,
      target,
    });
  };
}
