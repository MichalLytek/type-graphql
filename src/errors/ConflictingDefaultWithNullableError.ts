import { NullableListOptions } from "../decorators/types";

export class ConflictingDefaultWithNullableError extends Error {
  constructor(typeOwnerName: string, defaultValue: any, nullable: boolean | NullableListOptions) {
    super(
      `Wrong nullable option set for ${typeOwnerName}. ` +
        `You cannot combine default value '${defaultValue}' with nullable '${nullable}'.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
