import { ensureInstalledCorrectGraphQLPackage } from "../../src/utils/graphql-version";
import { UnmetGraphQLPeerDependencyError } from "../../src/errors";

describe("`graphql` package peer dependency", () => {
  it("should have installed correct version", async () => {
    ensureInstalledCorrectGraphQLPackage();
    expect(true).toBe(true);
  });

  it("should throw error when the installed version doesn't fulfill requirement", async () => {
    expect.assertions(5);
    jest.mock("graphql/package.json", () => ({
      version: "14.0.2",
    }));
    const graphqlVersion = require("../../src/utils/graphql-version");

    try {
      graphqlVersion.ensureInstalledCorrectGraphQLPackage();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(UnmetGraphQLPeerDependencyError);
      const error = err as UnmetGraphQLPeerDependencyError;
      expect(error.message).toContain("incorrect version");
      expect(error.message).toContain("graphql");
      expect(error.message).toContain("requirement");
    }
  });
});
