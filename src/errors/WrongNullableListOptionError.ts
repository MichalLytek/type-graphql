import { NullableListOptions } from '../decorators/types'

export class WrongNullableListOptionError extends Error {
  constructor(targetName: string, propertyName: string, nullable: boolean | NullableListOptions | undefined) {
    super(
      `Wrong nullable option set for ${targetName}#${propertyName}. ` +
        `You cannot combine non-list type with nullable '${nullable as string}'.`
    )

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
