import { validate } from "class-validator";
import { ArgumentValidationError, type ClassType, createMethodDecorator } from "type-graphql";

// Sample implementation of custom validation decorator
// This example use 'class-validator' however you can plug-in 'joi' or any other validation library
export function ValidateArgs<T extends object>(Type: ClassType<T>) {
  return createMethodDecorator(async ({ args }, next) => {
    const instance = Object.assign(new Type(), args);
    const validationErrors = await validate(instance);
    if (validationErrors.length > 0) {
      throw new ArgumentValidationError(validationErrors);
    }
    return next();
  });
}
