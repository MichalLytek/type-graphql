import { NullableListOptions } from "../decorators/types";

export class ConflictingDefaultWithNullableError extends Error {
  constructor(
    targetName: string,
    propertyName: string,
    defaultValue: any,
    nullable: boolean | NullableListOptions,
  ) {
    super(
      `Wrong nullable option set for ${targetName}#${propertyName}. ` +
        `You cannot combine default value '${defaultValue}' with nullable '${nullable}'.`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
