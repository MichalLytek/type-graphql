import * as graphql from "graphql";
import { versionPeerDependencies } from "@/version";

export class UnmetGraphQLPeerDependencyError extends Error {
  constructor() {
    super(
      `Looks like you use an incorrect version of the 'graphql' package: "${graphql.version}". ` +
        `Please ensure that you have installed a version ` +
        `that meets TypeGraphQL's requirement: "${versionPeerDependencies.graphql}".`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
