export class CannotDetermineTypeError extends Error {
  constructor(typeName: string, propertyKey: string, parameterIndex?: number) {
    let errorMessage = `Cannot determine type for ${typeName}#${propertyKey} `;
    if (parameterIndex !== undefined) {
      errorMessage += `parameter #${parameterIndex} `;
    }
    errorMessage += "!";
    super(errorMessage);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
