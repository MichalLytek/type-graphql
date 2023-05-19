import { GraphQLError } from "graphql";

export class AuthenticationError extends GraphQLError {
  extensions: {
    code: "UNAUTHENTICATED";
    [attributeName: string]: unknown; // GraphQLErrorExtensions
  };

  constructor(message = "Access denied! You need to be authenticated to perform this action!") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
