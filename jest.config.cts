import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";
import tsconfig from "./tsconfig.json";

export default {
  preset: "ts-jest",
  verbose: false,
  rootDir: "./",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testEnvironment: "node",
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/shim.ts",
    // Type-only declaration modules: they emit no executable code (only the
    // CommonJS `__esModule` marker) and are never loaded at runtime since every
    // consumer imports their types, so they can't be covered by tests.
    "!<rootDir>/src/typings/**/*.ts",
  ],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tests/tsconfig.json" }],
  },
  testMatch: ["**/functional/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageDirectory: "<rootDir>/coverage",
} satisfies JestConfigWithTsJest;
