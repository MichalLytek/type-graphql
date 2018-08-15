import { ValidationError } from "class-validator";

export class ArgumentValidationError extends Error {
  constructor(public validationErrors: ValidationError[]) {
    super("Argument Validation Error");

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
