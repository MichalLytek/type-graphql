module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/functional/**/*.ts", "**/units/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  rootDir: "./",
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  collectCoverage: true,
  mapCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/*.d.ts"],
  coverageDirectory: "<rootDir>/coverage",
};
