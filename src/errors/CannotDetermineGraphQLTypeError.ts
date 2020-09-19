export class CannotDetermineGraphQLTypeError extends Error {
  constructor(
    typeKind: "input" | "output",
    typeName: string,
    propertyKey: string,
    parameterIndex?: number,
    argName?: string,
  ) {
    let errorMessage = `Cannot determine GraphQL ${typeKind} type for `;
    if (argName) {
      errorMessage += `argument named '${argName}' of `;
    } else if (parameterIndex !== undefined) {
      errorMessage += `parameter #${parameterIndex} of `;
    }
    errorMessage +=
      `'${propertyKey}' of '${typeName}' class. ` +
      `Is the value, that is used as its TS type or explicit type, decorated with a proper ` +
      `decorator or is it a proper ${typeKind} value?`;

    super(errorMessage);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
