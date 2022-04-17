import { MetadataStorage } from './metadata/metadata-storage'

declare global {
  // eslint-disable-next-line no-var
  var TypeGraphQLMetadataStorage: MetadataStorage
}
