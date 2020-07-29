module.exports = {
  verbose: false,
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["<rootDir>/tests/**/*.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/tests/helpers",
    "<rootDir>/tests/artifacts",
    "<rootDir>/tests/.*integration.*",
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
  modulePathIgnorePatterns: [
    "<rootDir>/experiments",
    "<rootDir>/lib",
    "<rootDir>/package",
    "<rootDir>/tests/artifacts",
  ],
};
