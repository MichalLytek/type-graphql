import { MetadataStorage } from "../metadata/metadata-storage";

export function ArgsType(): ClassDecorator {
  return target => {
    MetadataStorage.collectArgsMetadata({
      name: target.name,
      target,
    });
  };
}
