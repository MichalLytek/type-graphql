export class InvalidParamDecoratorError extends Error {
  constructor() {
    super("Invalid paramDecorator configuration");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
