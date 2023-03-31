import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import tsconfig from "../tsconfig.cjs.json" assert { type: "json" };

const PACKAGE_JSON = { type: "commonjs" };
const PACKAGE_JSON_FILE = path.join(
  typeof __dirname !== "undefined" ? __dirname : path.dirname(url.fileURLToPath(import.meta.url)),
  "..",
  tsconfig.compilerOptions.outDir,
  "package.json",
);

if (fs.existsSync(PACKAGE_JSON_FILE)) {
  throw new Error(`CJS package.json '${PACKAGE_JSON_FILE}' already exists`);
}

fs.writeFileSync(PACKAGE_JSON_FILE, JSON.stringify(PACKAGE_JSON), { encoding: "utf8", flag: "w" });
