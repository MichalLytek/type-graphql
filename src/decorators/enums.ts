import { EnumConfig } from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export function registerEnumType<T extends object>(enumObj: T, enumConfig: EnumConfig) {
  getMetadataStorage().collectEnumMetadata({
    enumObj,
    name: enumConfig.name,
    description: enumConfig.description,
  });
}
