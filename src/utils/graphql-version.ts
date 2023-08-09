import * as graphql from "graphql";
import semVer from "semver";
// Avoid '@/' due to 'scripts/version.ts'
import { UnmetGraphQLPeerDependencyError } from "../errors";

// This must be kept in sync with 'package.json'
export const graphQLPeerDependencyVersion = "^16.7.1";

export function ensureInstalledCorrectGraphQLPackage() {
  if (!semVer.satisfies(graphql.version, graphQLPeerDependencyVersion)) {
    throw new UnmetGraphQLPeerDependencyError(graphql.version, graphQLPeerDependencyVersion);
  }
}
