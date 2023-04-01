import type { MetadataStorage } from "@/metadata/metadata-storage";

declare namespace NodeJS {
  interface Global {
    TypeGraphQLMetadataStorage: MetadataStorage;
  }
}
