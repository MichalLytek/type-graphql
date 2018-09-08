declare namespace Reflect {
  function getMetadata(metadataKey: any, target: Object): any;
  function getMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any;
}

declare namespace NodeJS {
  interface Global {
    TypeGraphQLMetadataStorage: import ("../src/metadata/metadata-storage").MetadataStorage;
  }
}
