import { MetadataStorage } from "../metadata/metadata-storage";
import { ClassType } from "../types/decorators";

export function GraphQLResolver(typeFunc: () => ClassType): ClassDecorator {
  return target => {
    MetadataStorage.registerResolver({
      target,
      getParentType: typeFunc,
    });
  };
}
