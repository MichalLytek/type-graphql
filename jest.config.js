module.exports = {
  verbose: false,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/functional/**/*.ts", "**/units/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  rootDir: "./",
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/browser-shim.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
  testEnvironment: "node",
};
