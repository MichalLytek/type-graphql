import * as graphql from "graphql";
import semVer from "semver";
import { UnmetGraphQLPeerDependencyError } from "@/errors";
import { versionPeerDependencies } from "@/version";

export function ensureInstalledCorrectGraphQLPackage() {
  if (!semVer.satisfies(graphql.version, versionPeerDependencies.graphql)) {
    throw new UnmetGraphQLPeerDependencyError();
  }
}
