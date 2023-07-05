// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 'class-validator' might not be installed by user
import type { ValidationError, ValidatorOptions } from "class-validator";
import type { TypeValue } from "@/decorators/types";
import { ArgumentValidationError } from "@/errors";
import type { ValidateSettings } from "@/schema/build-context";
import type { ResolverData, ValidatorFn } from "@/typings";

const shouldArgBeValidated = (argValue: unknown): boolean =>
  argValue !== null && typeof argValue === "object";

export async function validateArg(
  argValue: any | undefined,
  argType: TypeValue,
  resolverData: ResolverData,
  globalValidate: ValidateSettings,
  argValidate: ValidateSettings | undefined,
  validateFn: ValidatorFn | undefined,
): Promise<any | undefined> {
  if (typeof validateFn === "function") {
    await validateFn(argValue, argType, resolverData);
    return argValue;
  }

  const validate = argValidate !== undefined ? argValidate : globalValidate;
  if (validate === false || !shouldArgBeValidated(argValue)) {
    return argValue;
  }

  const validatorOptions: ValidatorOptions = {
    ...(typeof globalValidate === "object" ? globalValidate : {}),
    ...(typeof argValidate === "object" ? argValidate : {}),
  };
  if (validatorOptions.skipMissingProperties !== false) {
    validatorOptions.skipMissingProperties = true;
  }
  if (validatorOptions.forbidUnknownValues !== true) {
    validatorOptions.forbidUnknownValues = false;
  }

  // Dynamic import to avoid making 'class-validator' a peer dependency when `validate: true` is not set
  const { validateOrReject } = await import("class-validator");
  try {
    if (Array.isArray(argValue)) {
      await Promise.all(
        argValue
          .filter(shouldArgBeValidated)
          .map(argItem => validateOrReject(argItem, validatorOptions)),
      );
    } else {
      await validateOrReject(argValue, validatorOptions);
    }
    return argValue;
  } catch (err) {
    throw new ArgumentValidationError(err as ValidationError[]);
  }
}
