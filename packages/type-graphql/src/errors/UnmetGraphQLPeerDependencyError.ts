export class UnmetGraphQLPeerDependencyError extends Error {
  constructor(graphQLVersion: string, graphQLPeerDependencyVersion: string) {
    super(
      `Looks like you use an incorrect version of the 'graphql' package: "${graphQLVersion}". ` +
        `Please ensure that you have installed a version ` +
        `that meets TypeGraphQL's requirement: "${graphQLPeerDependencyVersion}".`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
