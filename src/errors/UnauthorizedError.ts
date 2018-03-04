export class UnauthorizedError extends Error {
  constructor() {
    super("Access denied! You need to be authorized to perform this action!");

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
