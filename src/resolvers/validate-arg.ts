import { validateOrReject, ValidatorOptions } from "class-validator";

import { ArgumentValidationError } from "../errors/ArgumentValidationError";

export async function validateArg<T extends Object>(
  arg: T | undefined,
  globalValidate: boolean | ValidatorOptions,
  argValidate?: boolean | ValidatorOptions,
): Promise<T | undefined> {
  if (!arg) {
    return;
  }

  const validate = argValidate !== undefined ? argValidate : globalValidate;
  if (validate === false || arg == null || typeof arg !== "object") {
    return arg;
  }

  const validatorOptions: ValidatorOptions = Object.assign({}, globalValidate, argValidate);
  if (validatorOptions.skipMissingProperties !== false) {
    validatorOptions.skipMissingProperties = true;
  }

  try {
    await validateOrReject(arg, validatorOptions);
    return arg;
  } catch (err) {
    throw new ArgumentValidationError(err);
  }
}
