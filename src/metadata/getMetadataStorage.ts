import { MetadataStorage } from "../metadata/metadata-storage";

declare global {
  var TypeGraphQLMetadataStorage: MetadataStorage;
}

export function getMetadataStorage(): MetadataStorage {
  return (
    global.TypeGraphQLMetadataStorage || (global.TypeGraphQLMetadataStorage = new MetadataStorage())
  );
}
