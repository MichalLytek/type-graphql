import { GraphQLError } from "graphql";

import { ArgumentValidationError } from "./ArgumentValidationError";

export function formatArgumentValidationError(err: GraphQLError) {
  const formattedError: { [key: string]: any } = {};

  formattedError.message = err.message;
  formattedError.locations = err.locations;
  formattedError.path = err.path;

  if (err.originalError instanceof ArgumentValidationError) {
    formattedError.validationErrors = err.originalError.validationErrors;
  }

  return formattedError;
}
