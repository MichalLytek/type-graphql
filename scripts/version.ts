#!/usr/bin/env ts-node

import packageJson from "../packages/type-graphql/package.json";
import { graphQLPeerDependencyVersion } from "../packages/type-graphql/src/utils/graphql-version";

if (graphQLPeerDependencyVersion !== packageJson.peerDependencies.graphql) {
  throw new Error(
    `GraphQL peer dependency version (${graphQLPeerDependencyVersion}) != package.json.peerDependencies.graphql (${packageJson.peerDependencies.graphql})`,
  );
}
