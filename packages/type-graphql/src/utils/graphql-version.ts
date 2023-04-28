import * as graphql from "graphql";
import semVer from "semver";
import { UnmetGraphQLPeerDependencyError } from "@/errors";

export const graphQLPeerDependencyVersion = "^16.6.0";

export function ensureInstalledCorrectGraphQLPackage() {
  if (!semVer.satisfies(graphql.version, graphQLPeerDependencyVersion)) {
    throw new UnmetGraphQLPeerDependencyError(graphql.version, graphQLPeerDependencyVersion);
  }
}
