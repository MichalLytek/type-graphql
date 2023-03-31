import fs from "node:fs";
import path from "node:path";
import tsconfig from "../tsconfig.esm.json";

const PACKAGE_JSON = { type: "module" };
const PACKAGE_JSON_FILE = path.join(
  __dirname,
  `../${tsconfig.compilerOptions.outDir}/package.json`,
);

if (fs.existsSync(PACKAGE_JSON_FILE)) {
  throw new Error(`ESM package.json '${PACKAGE_JSON_FILE}' already exists`);
}

fs.writeFileSync(PACKAGE_JSON_FILE, JSON.stringify(PACKAGE_JSON), { encoding: "utf8", flag: "w" });
