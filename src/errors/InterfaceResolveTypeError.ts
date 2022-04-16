import { ClassMetadata } from '../metadata/definitions'

export class InterfaceResolveTypeError extends Error {
  constructor(interfaceMetadata: ClassMetadata) {
    super(
      `Cannot resolve type for interface ${interfaceMetadata.name}! ` +
        `You need to return instance of object type class, not a plain object!`
    )

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
