import "reflect-metadata";
import * as typeGraphQL from "type-graphql";
import packageJson from "../package.json";

const versionInfoString = `${typeGraphQL.versionInfo.major}.${typeGraphQL.versionInfo.minor}.${
  typeGraphQL.versionInfo.patch
}${typeGraphQL.versionInfo.preReleaseTag ?? ""}`;

const versionPeerDependenciesString = JSON.stringify(typeGraphQL.versionPeerDependencies);

const packageJsonPeerDependenciesString = JSON.stringify(packageJson.peerDependencies);

if (typeGraphQL.version !== packageJson.version) {
  throw new Error(
    `version (${typeGraphQL.version}) != package.json.version (${packageJson.version})`,
  );
}

if (typeGraphQL.version !== versionInfoString) {
  throw new Error(`version (${typeGraphQL.version}) != versionInfo (${versionInfoString})`);
}

if (versionPeerDependenciesString !== packageJsonPeerDependenciesString) {
  throw new Error(
    `versionPeerDependencies (${versionPeerDependenciesString}) != package.json.peerDependencies (${packageJsonPeerDependenciesString})`,
  );
}
