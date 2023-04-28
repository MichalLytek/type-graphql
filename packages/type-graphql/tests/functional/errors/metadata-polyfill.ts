import { ReflectMetadataMissingError } from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { getError } from "../../helpers/getError";

describe("Reflect metadata", () => {
  it("should throw ReflectMetadataMissingError when no polyfill provided", async () => {
    const error = await getError(() => getMetadataStorage());

    expect(error).toBeInstanceOf(ReflectMetadataMissingError);
    expect(error.message).toContain("metadata");
    expect(error.message).toContain("polyfill");
  });
});
