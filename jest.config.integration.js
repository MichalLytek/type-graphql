const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  testMatch: ["<rootDir>/tests/**/*integration.ts"],
  testPathIgnorePatterns: baseConfig.testPathIgnorePatterns.filter(
    it => it !== "<rootDir>/tests/.*integration.*",
  ),
};
