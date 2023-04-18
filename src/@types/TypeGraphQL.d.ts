import type { MetadataStorage } from "@/metadata/metadata-storage";

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var TypeGraphQLMetadataStorage: MetadataStorage;
}
