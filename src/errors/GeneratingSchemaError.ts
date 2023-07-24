import type { GraphQLError } from "graphql";

export class GeneratingSchemaError extends Error {
  details: readonly GraphQLError[];

  constructor(details: readonly GraphQLError[]) {
    let errorMessage = "Some errors occurred while generating GraphQL schema:\n";
    errorMessage += details.map(it => `  ${it.message}\n`);
    errorMessage += "Please check the `details` property of the error to get more detailed info.";

    super(errorMessage);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
  }
}
