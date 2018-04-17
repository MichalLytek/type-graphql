import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { MiddlewareFn, ArgumentValidationError, UseMiddleware } from "../../../src";
import { ClassType } from "../../../src/types/decorators";

// sample implementation of custom validation decorator
// this example use `class-validator` however you can plug-in `joi` or any other lib
export function ValidateArgs<T extends object>(type: ClassType<T>) {
  return UseMiddleware(async ({ args }, next) => {
    const instance = plainToClass(type, args);
    const validationErrors = await validate(instance);
    if (validationErrors.length > 0) {
      throw new ArgumentValidationError(validationErrors);
    }
    return next();
  });
}
