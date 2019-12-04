module.exports = {
  verbose: false,
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: [
    "<rootDir>/tests/**/*.ts",
    "!<rootDir>/tests/helpers/**/*.ts",
    "!<rootDir>/tests/artifacts/**/*.ts",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/tests/helpers",
    "<rootDir>/tests/artifacts",
  ],
  rootDir: "./",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tests/tsconfig.json",
    },
  },
  collectCoverage: false,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/*.d.ts"],
};
