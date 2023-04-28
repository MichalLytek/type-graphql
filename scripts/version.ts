#!/usr/bin/env ts-node

import { graphQLPeerDependencyVersion } from "@/utils/graphql-version";
import packageJson from "../packages/type-graphql/package.json";

if (graphQLPeerDependencyVersion !== packageJson.peerDependencies.graphql) {
  throw new Error(
    `GraphQL peer dependency version (${graphQLPeerDependencyVersion}) != package.json.peerDependencies.graphql (${packageJson.peerDependencies.graphql})`,
  );
}
