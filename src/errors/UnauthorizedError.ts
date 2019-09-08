import { ClientError } from "./ClientError";

export class UnauthorizedError extends ClientError {
  constructor() {
    super("Access denied! You need to be authorized to perform this action!");

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
