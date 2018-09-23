import { MetadataStorage } from "../metadata/metadata-storage";
import clone = require("lodash.clonedeep");

// Yeah, you know, global state/non-reentrancy is a big bitch to deal with
// Keep in mind that we still have promise global state hazard to think of
let clonedMetadata: MetadataStorage | null;

export function cloneMetadataStorage() {
  if (global.TypeGraphQLMetadataStorage) {
    clonedMetadata = clone(global.TypeGraphQLMetadataStorage);
  }
}

export function restoreClonedMetadataStorage() {
  global.TypeGraphQLMetadataStorage = clonedMetadata || global.TypeGraphQLMetadataStorage;
}
