import { validate } from 'class-validator'
import { ClassType, ArgumentValidationError, createMethodDecorator } from '../../../src'

// sample implementation of custom validation decorator
// this example use `class-validator` however you can plug-in `joi` or any other lib
export function ValidateArgs<T extends object>(Type: ClassType<T>): MethodDecorator {
  return createMethodDecorator(async ({ args }, next) => {
    const instance = Object.assign(new Type(), args)
    const validationErrors = await validate(instance)
    if (validationErrors.length > 0) {
      throw new ArgumentValidationError(validationErrors)
    }
    return next()
  })
}
