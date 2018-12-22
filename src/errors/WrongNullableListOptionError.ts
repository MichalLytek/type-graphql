import { NullableListOptions } from "../decorators/types";

export class WrongNullableListOptionError extends Error {
  constructor(typeOwnerName: string, nullable: boolean | NullableListOptions | undefined) {
    super(
      `Wrong nullable option set for ${typeOwnerName}. ` +
        `You cannot combine non-list type with nullable '${nullable}'.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
