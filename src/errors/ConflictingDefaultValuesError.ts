export class ConflictingDefaultValuesError extends Error {
  constructor(typeName: string, fieldName: string, defaultValueFromDecorator: any, defaultValueFromInitializer: any) {
    super(
      `The '${fieldName}' field of '${typeName}' has conflicting default values. ` +
        `Default value from decorator ('${defaultValueFromDecorator as string}') ` +
        `is not equal to the property initializer value ('${defaultValueFromInitializer as string}').`
    )

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
