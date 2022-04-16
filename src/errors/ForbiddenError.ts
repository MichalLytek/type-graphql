export class ForbiddenError extends Error {
  constructor() {
    super("Access denied! You don't have permission for this action!")

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
