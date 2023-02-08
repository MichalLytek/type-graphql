import { MetadataStorage } from "./metadata-storage";

// FIXME: Global
declare global {
  // eslint-disable-next-line no-var
  var TypeGraphQLMetadataStorage: MetadataStorage;
}

export function getMetadataStorage(): MetadataStorage {
  return (
    global.TypeGraphQLMetadataStorage || (global.TypeGraphQLMetadataStorage = new MetadataStorage())
  );
}
