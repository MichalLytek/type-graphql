import { GraphQLError } from "graphql";

export class AuthorizationError extends GraphQLError {
  public constructor(message = "Access denied! You don't have permission for this action!") {
    super(message, { extensions: { code: "UNAUTHORIZED" } });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
