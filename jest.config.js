module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/functional/**/*.ts", "**/units/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  mapCoverage: true,
  rootDir: "./",
  roots: ["<rootDir>/tests", "<rootDir>/src"],
};
