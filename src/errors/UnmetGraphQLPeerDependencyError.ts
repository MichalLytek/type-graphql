import {
  getInstalledGraphQLVersion,
  getPeerDependencyGraphQLRequirement,
} from "@/utils/graphql-version";

export class UnmetGraphQLPeerDependencyError extends Error {
  constructor() {
    super(
      `Looks like you use an incorrect version of the 'graphql' package: "${getInstalledGraphQLVersion()}". ` +
        `Please ensure that you have installed a version ` +
        `that meets TypeGraphQL's requirement: "${getPeerDependencyGraphQLRequirement()}".`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
