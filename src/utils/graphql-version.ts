import * as graphql from "graphql";
import semVer from "semver";
import { UnmetGraphQLPeerDependencyError } from "@/errors";

// this has to be kept in sync with package.json
export const graphQLPeerDependencyVersion = "^16.6.0";

export function ensureInstalledCorrectGraphQLPackage() {
  if (!semVer.satisfies(graphql.version, graphQLPeerDependencyVersion)) {
    throw new UnmetGraphQLPeerDependencyError(graphql.version, graphQLPeerDependencyVersion);
  }
}
