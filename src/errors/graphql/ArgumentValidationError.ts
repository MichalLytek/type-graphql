// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore `class-validator` might not be installed by user
import type { ValidationError } from "class-validator";
import { GraphQLError } from "graphql";

export class ArgumentValidationError extends GraphQLError {
  override readonly extensions!: {
    code: "BAD_USER_INPUT";
    validationErrors: ValidationError[];
    [attributeName: string]: unknown; // GraphQLErrorExtensions
  };

  constructor(validationErrors: ValidationError[]) {
    super("Argument Validation Error", {
      extensions: {
        code: "BAD_USER_INPUT",
        validationErrors,
      },
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
