import semVer from 'semver'

import { UnmetGraphQLPeerDependencyError } from '../errors'

export function getInstalledGraphQLVersion(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const graphqlPackageJson = require('graphql/package.json')
  return graphqlPackageJson.version
}

export function getPeerDependencyGraphQLRequirement(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ownPackageJson = require('../../package.json')
  return ownPackageJson.peerDependencies.graphql
}

export function ensureInstalledCorrectGraphQLPackage(): void {
  const installedVersion = getInstalledGraphQLVersion()
  const versionRequirement = getPeerDependencyGraphQLRequirement()

  if (!semVer.satisfies(installedVersion, versionRequirement)) {
    throw new UnmetGraphQLPeerDependencyError()
  }
}
