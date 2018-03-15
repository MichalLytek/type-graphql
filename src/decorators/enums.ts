import { EnumConfig } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";

export function registerEnumType<T extends object>(enumObj: T, enumConfig: EnumConfig) {
  MetadataStorage.registerEnumDefinition({
    enumObj,
    name: enumConfig.name,
    description: enumConfig.description,
  });
}
