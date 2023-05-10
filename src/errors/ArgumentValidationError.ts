// @ts-ignore `class-validator` might not be installed by user
import type { ValidationError } from "class-validator";

export class ArgumentValidationError extends Error {
  constructor(public validationErrors: ValidationError[]) {
    super("Argument Validation Error");

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
