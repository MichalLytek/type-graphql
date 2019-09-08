import { ValidationError } from "class-validator";
import { ClientError } from "./ClientError";

export class ArgumentValidationError extends ClientError {
  constructor(public validationErrors: ValidationError[]) {
    super("Argument Validation Error");

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
