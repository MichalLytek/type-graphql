export class MissingSubscriptionTopicsError extends Error {
  constructor(target: Function, methodName: string) {
    super(`${target.name}#${methodName} subscription has no provided topics!`);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
