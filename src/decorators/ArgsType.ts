import { getMetadataStorage } from "~/metadata/getMetadataStorage";

export function ArgsType(): ClassDecorator {
  return target => {
    getMetadataStorage().collectArgsMetadata({
      name: target.name,
      target,
    });
  };
}
