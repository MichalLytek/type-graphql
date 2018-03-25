import { UnionDefinition } from "../metadata/definition-interfaces";

export class UnionResolveTypeError extends Error {
  constructor(unionDefinition: UnionDefinition) {
    super(
      `Cannot resolve type for union ${unionDefinition.name}! ` +
        `You need to return instance of object type class, not a plain object!`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
