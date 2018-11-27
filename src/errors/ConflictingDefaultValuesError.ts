export class ConflictingDefaultValuesError extends Error {
  constructor(
    typeName: string,
    fieldName: string,
    defaultValueFromDecorator: any,
    defaultValueFromInitializer: any,
  ) {
    super(
      `The '${fieldName}' field of '${typeName}' has conflicting default values. ` +
        `Default value from decorator ('${defaultValueFromDecorator}') ` +
        `is not equal to the property initializer value ('${defaultValueFromInitializer}').`,
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
