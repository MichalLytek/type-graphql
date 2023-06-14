import { ReflectMetadataMissingError } from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { expectToThrow } from "../../helpers/expectToThrow";

describe("Reflect metadata", () => {
  it("should throw ReflectMetadataMissingError when no polyfill provided", async () => {
    const error = await expectToThrow(() => getMetadataStorage());

    expect(error).toBeInstanceOf(ReflectMetadataMissingError);
    expect(error.message).toContain("metadata");
    expect(error.message).toContain("polyfill");
  });
});
