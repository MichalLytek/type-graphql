import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type EnumConfig } from "./types";

export function registerEnumType<TEnum extends object>(
  enumObj: TEnum,
  enumConfig: EnumConfig<TEnum>,
) {
  getMetadataStorage().collectEnumMetadata({
    enumObj,
    name: enumConfig.name,
    description: enumConfig.description,
    valuesConfig: enumConfig.valuesConfig || {},
  });
}
