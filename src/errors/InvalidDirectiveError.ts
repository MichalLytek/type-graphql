import { DirectiveMetadata } from "../metadata/definitions/directive-metadata";

export class InvalidDirectiveError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
