import { ClientError } from "./ClientError";

export class ForbiddenError extends ClientError {
  constructor() {
    super("Access denied! You don't have permission for this action!");

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
