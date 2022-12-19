declare namespace NodeJS {
  interface Global {
    TypeGraphQLMetadataStorage: import("~/metadata/metadata-storage").MetadataStorage;
  }
}
