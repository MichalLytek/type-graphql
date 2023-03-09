import type { ValidationError } from "class-validator";
import { GraphQLError } from "graphql";

export class ArgumentValidationError extends GraphQLError {
  public constructor(validationErrors: ValidationError[]) {
    super("Argument Validation Error", {
      extensions: {
        code: "BAD_USER_INPUT",
        validationErrors,
      },
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
