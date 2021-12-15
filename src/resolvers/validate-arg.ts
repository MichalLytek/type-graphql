import type { ValidatorOptions } from "class-validator";
import { ResolverData } from "..";
import { TypeValue } from "../decorators/types";

import { ArgumentValidationError } from "../errors/ArgumentValidationError";
import { ValidateSettings } from "../schema/build-context";

export async function validateArg<ContextType, T extends object>(
  argValue: T | undefined,
  argType: TypeValue,
  resolverData: ResolverData<ContextType>,
  globalValidate: ValidateSettings,
  argValidate: ValidateSettings | undefined,
): Promise<T | undefined> {
  const validate = argValidate !== undefined ? argValidate : globalValidate;
  if (validate === false || argValue == null || typeof argValue !== "object") {
    return argValue;
  }

  if (typeof validate === "function") {
    await validate(resolverData, argValue, argType);
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
      await Promise.all(argValue.map(argItem => validateOrReject(argItem, validatorOptions)));
    } else {
      await validateOrReject(argValue, validatorOptions);
    }
    return argValue;
  } catch (err) {
    throw new ArgumentValidationError(err);
  }
}
