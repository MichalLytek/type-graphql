import { ReflectMetadataMissingError } from "type-graphql";
import { findType } from "@/helpers/findType";
import { expectToThrow } from "../../helpers/expectToThrow";

describe("Reflect metadata", () => {
  it("should throw ReflectMetadataMissingError when no polyfill provided", async () => {
    const error = await expectToThrow(() =>
      findType({
        metadataKey: "design:type",
        prototype: {},
        propertyKey: "test",
      }),
    );

    expect(error).toBeInstanceOf(ReflectMetadataMissingError);
    expect(error.message).toContain("metadata");
    expect(error.message).toContain("polyfill");
  });
});
