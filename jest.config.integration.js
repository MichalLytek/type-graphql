const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  testMatch: ["<rootDir>/tests/**/*integration.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/tests/helpers",
    "<rootDir>/tests/artifacts",
  ],
};
