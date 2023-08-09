import { MetadataStorage } from "./metadata-storage";

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var TypeGraphQLMetadataStorage: MetadataStorage;
}

export function getMetadataStorage(): MetadataStorage {
  if (!global.TypeGraphQLMetadataStorage) {
    global.TypeGraphQLMetadataStorage = new MetadataStorage();
  }

  return global.TypeGraphQLMetadataStorage;
}
