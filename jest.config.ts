import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";
import tsconfig from "./tsconfig.json";

export default <JestConfigWithTsJest>{
  preset: "ts-jest",
  verbose: false,
  rootDir: "./",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testEnvironment: "node",
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/browser-shim.ts",
  ],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tests/tsconfig.json" }],
  },
  testMatch: ["**/functional/**/*.ts", "**/units/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageDirectory: "<rootDir>/coverage",
};
