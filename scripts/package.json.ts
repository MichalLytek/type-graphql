import fs from "node:fs";
import path from "node:path";
import tsconfig from "../tsconfig.esm.json";

const packageJson = { type: "module" };
const packageJsonFile = path.resolve(
  __dirname,
  `../${tsconfig.compilerOptions.outDir}/package.json`,
);

if (fs.existsSync(packageJsonFile)) {
  throw new Error(`ESM package.json '${packageJsonFile}' already exists`);
}

fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson), { encoding: "utf8", flag: "w" });
