import { DirectiveMetadata } from "../metadata/definitions/directive-metadata";

export class InvalidDirectiveError extends Error {
  constructor(msg: string, directive: DirectiveMetadata) {
    super(`${msg} "${directive.nameOrDefinition}" `);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
