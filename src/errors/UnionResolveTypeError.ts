import { UnionDefinition } from "../metadata/definition-interfaces";

export class UnionResolveTypeError extends Error {
  constructor(unionDefintion: UnionDefinition) {
    super(
      `Cannot resolve type for union ${unionDefintion.name}! ` +
        `You need to return instance of object type class, not a plain object!`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
