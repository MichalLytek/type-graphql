import type { ValidatorOptions } from "class-validator";

import { ArgumentValidationError } from "../errors/ArgumentValidationError";

export async function validateArg<T extends Object>(
  arg: T | undefined,
  globalValidate: boolean | ValidatorOptions,
  argValidate?: boolean | ValidatorOptions,
): Promise<T | undefined> {
  const validate = argValidate !== undefined ? argValidate : globalValidate;
  if (validate === false || arg == null || typeof arg !== "object") {
    return arg;
  }

  const validatorOptions: ValidatorOptions = Object.assign(
    {},
    typeof globalValidate === "object" ? globalValidate : {},
    typeof argValidate === "object" ? argValidate : {},
  );
  if (validatorOptions.skipMissingProperties !== false) {
    validatorOptions.skipMissingProperties = true;
  }

  const { validateOrReject } = await import("class-validator");
  try {
    if (Array.isArray(arg)) {
      await Promise.all(arg.map((argItem) => validateOrReject(argItem, validatorOptions)));
    } else {
      await validateOrReject(arg, validatorOptions);
    }
    return arg;
  } catch (err) {
    throw new ArgumentValidationError(err);
  }
}
