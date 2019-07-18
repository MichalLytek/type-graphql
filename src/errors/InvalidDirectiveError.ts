import { DirectiveMetadata } from "../metadata/definitions/directive-metadata";

export class InvalidDirectiveError extends Error {
  constructor(directive: DirectiveMetadata) {
    super(`Invalid directive "${directive.nameOrSDL}" `);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
