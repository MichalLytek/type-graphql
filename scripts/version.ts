import { graphQLPeerDependencyVersion } from "@/utils/graphql-version";
import packageJson from "../package.json";

if (graphQLPeerDependencyVersion !== packageJson.peerDependencies.graphql) {
  throw new Error(
    `GraphQL peer dependency version (${graphQLPeerDependencyVersion}) != package.json.peerDependencies.graphql (${packageJson.peerDependencies.graphql})`,
  );
}
