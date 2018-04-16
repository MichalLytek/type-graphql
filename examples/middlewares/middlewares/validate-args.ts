import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { MiddlewareFn, ArgumentValidationError } from "../../../src";
import { ClassType } from "../../../src/types/decorators";

// sample implementation of validation logic
// this example use `class-validator`
// however you can plug-in `joi` or other lib
export function ValidateArgs<T extends object>(type: ClassType<T>): MiddlewareFn {
  return async ({ args }, next) => {
    const instance = plainToClass(type, args);
    const validationErrors = await validate(instance);
    if (validationErrors.length > 0) {
      throw new ArgumentValidationError(validationErrors);
    }
    return next();
  };
}
