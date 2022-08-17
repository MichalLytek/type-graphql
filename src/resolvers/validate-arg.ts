import type { ValidatorOptions } from "class-validator";
import { TypeValue } from "../decorators/types";

import { ArgumentValidationError } from "../errors/ArgumentValidationError";
import { ValidateSettings } from "../schema/build-context";

const shouldArgBeValidated = (argValue: unknown): boolean =>
  argValue !== null && typeof argValue === "object";

export async function validateArg<T extends object>(
  argValue: T | undefined,
  argType: TypeValue,
  globalValidate: ValidateSettings,
  argValidate: ValidateSettings | undefined,
): Promise<T | undefined> {
  const validate = argValidate !== undefined ? argValidate : globalValidate;
  if (validate === false || !shouldArgBeValidated(argValue)) {
    return argValue;
  }

  if (typeof validate === "function") {
    await validate(argValue, argType);
    return argValue;
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
    if (Array.isArray(argValue)) {
      await Promise.all(
        argValue
          .filter(shouldArgBeValidated)
          .map(argItem => validateOrReject(argItem, validatorOptions)),
      );
    } else {
      await validateOrReject(argValue as T, validatorOptions);
    }
    return argValue;
  } catch (err) {
    throw new ArgumentValidationError(err);
  }
}
