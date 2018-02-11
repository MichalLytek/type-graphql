module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  mapCoverage: true,
  rootDir: "./",
  roots: ["<rootDir>/tests/functional", "<rootDir>/tests/units", "<rootDir>/src"],
};
