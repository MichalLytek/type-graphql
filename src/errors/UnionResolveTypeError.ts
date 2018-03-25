import { UnionMetadata } from "../metadata/definitions";

export class UnionResolveTypeError extends Error {
  constructor(unionMetadata: UnionMetadata) {
    super(
      `Cannot resolve type for union ${unionMetadata.name}! ` +
        `You need to return instance of object type class, not a plain object!`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
