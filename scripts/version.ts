#!/usr/bin/env ts-node

import packageJson from "../package.json";
import { graphQLPeerDependencyVersion } from "../src/utils/graphql-version";

if (graphQLPeerDependencyVersion !== packageJson.peerDependencies.graphql) {
  throw new Error(
    `GraphQL peer dependency version (${graphQLPeerDependencyVersion}) != package.json.peerDependencies.graphql (${packageJson.peerDependencies.graphql})`,
  );
}
