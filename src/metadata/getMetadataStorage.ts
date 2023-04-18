import { MetadataStorage } from "./metadata-storage";

export function getMetadataStorage(): MetadataStorage {
  if (!global.TypeGraphQLMetadataStorage) {
    global.TypeGraphQLMetadataStorage = new MetadataStorage();
  }

  return global.TypeGraphQLMetadataStorage;
}
