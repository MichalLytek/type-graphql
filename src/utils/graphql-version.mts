import module from "node:module";
import semVer from "semver";
import { UnmetGraphQLPeerDependencyError } from "@/errors";

const require = module.createRequire(import.meta.url);

export function getInstalledGraphQLVersion(): string {
  // eslint-disable-next-line global-require
  const graphqlPackageJson = require("graphql/package.json");
  return graphqlPackageJson.version;
}

export function getPeerDependencyGraphQLRequirement(): string {
  // eslint-disable-next-line global-require
  const ownPackageJson = require("../../package.json");
  return ownPackageJson.peerDependencies.graphql;
}

export function ensureInstalledCorrectGraphQLPackage() {
  const installedVersion = getInstalledGraphQLVersion();
  const versionRequirement = getPeerDependencyGraphQLRequirement();

  if (!semVer.satisfies(installedVersion, versionRequirement)) {
    throw new UnmetGraphQLPeerDependencyError();
  }
}
