import { ensureInstalledCorrectGraphQLPackage } from "@/utils/graphql-version";

describe("`graphql` package peer dependency", () => {
  it("should have installed correct version", async () => {
    expect(ensureInstalledCorrectGraphQLPackage).not.toThrow();
  });
});
