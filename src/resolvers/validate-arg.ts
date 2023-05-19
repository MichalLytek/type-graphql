// @ts-ignore `class-validator` might not be installed by user
import type { ValidatorOptions } from "class-validator";

import { TypeValue } from "../decorators/types";
import { ArgumentValidationError } from "../errors";
import { ValidateSettings } from "../schema/build-context";
import { ValidatorFn } from "../interfaces/ValidatorFn";

const shouldArgBeValidated = (argValue: unknown): boolean =>
  argValue !== null && typeof argValue === "object";

export async function validateArg<T extends object>(
  argValue: T | undefined,
  argType: TypeValue,
  globalValidate: ValidateSettings,
  argValidate: ValidateSettings | undefined,
  validateFn: ValidatorFn<object> | undefined,
): Promise<T | undefined> {
  if (typeof validateFn === "function") {
    await validateFn(argValue, argType);
    return argValue;
  }

  const validate = argValidate !== undefined ? argValidate : globalValidate;
  if (validate === false || !shouldArgBeValidated(argValue)) {
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
  if (validatorOptions.forbidUnknownValues !== true) {
    validatorOptions.forbidUnknownValues = false;
  }

  // dynamic import to avoid making `class-validator` a peer dependency when `validate: true` is not set
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
