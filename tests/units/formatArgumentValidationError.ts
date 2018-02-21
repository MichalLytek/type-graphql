import { GraphQLError } from "graphql";
import { MinLength, validate } from "class-validator";

import { formatArgumentValidationError, ArgumentValidationError } from "../../src";

describe("formatArgumentValidationError", () => {
  class SampleClass {
    @MinLength(8)
    min8lengthProperty: string;
  }

  it("should properly transform GraphQLError into validation errors object", async () => {
    const sample = new SampleClass();
    sample.min8lengthProperty = "12345";

    const validationErrors = await validate(sample);
    const argumentValidationError = new ArgumentValidationError(validationErrors);
    const error = new GraphQLError(
      "error message",
      undefined,
      undefined,
      undefined,
      undefined,
      argumentValidationError,
    );

    const formattedError = formatArgumentValidationError(error);
    expect(formattedError.message).toEqual("error message");
    expect(formattedError.validationErrors).toHaveLength(1);
    expect(formattedError.validationErrors).toEqual(validationErrors);
  });
});
