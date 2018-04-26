import { MetadataStorage } from "../metadata/metadata-storage";

export function getMetadataStorage(): MetadataStorage {
  return (global.TypeGraphQLMetadataStorage =
    global.TypeGraphQLMetadataStorage || new MetadataStorage());
}
