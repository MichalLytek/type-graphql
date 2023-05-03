#!/usr/bin/env ts-node

import fs from "node:fs";
import path from "node:path";
import expect from "expect";
// eslint-disable-next-line import/no-extraneous-dependencies
import typescript from "typescript";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

type TsConfig = Omit<typescript.ParsedCommandLine, "raw"> & { raw: { include: string[] } };

function readTsConfig(fileName: string): TsConfig {
  const config = typescript.readConfigFile(fileName, typescript.sys.readFile);
  expect(config.config).toBeDefined();
  expect(config.error).toBeUndefined();

  const configJson = typescript.parseJsonConfigFileContent(
    config.config,
    typescript.sys,
    path.dirname(fileName),
  );
  expect(configJson.options.outDir).toBeDefined();
  expect(configJson.raw.include).toBeDefined();
  expect(Array.isArray(configJson.raw.include)).toBeTruthy();
  expect(configJson.raw.include.length).toBeGreaterThanOrEqual(1);

  return configJson as TsConfig;
}

function writePackageJson(fileName: string, fileContent: string | NodeJS.ArrayBufferView): void {
  const fileBasename = path.basename(fileName);
  const fileDirname = path.dirname(fileName);

  expect(fileBasename).toBe("package.json");
  if (!fs.existsSync(fileDirname)) {
    throw new Error(`Directory '${fileDirname}' does not exists`);
  }
  if (fs.existsSync(fileName)) {
    throw new Error(`File '${fileName}' already exists`);
  }

  fs.writeFileSync(fileName, fileContent, {
    encoding: "utf8",
    flag: "w",
  });
}

const enum ANALYZE {
  ROOT = "root",
  EXAMPLES = "examples",
}

const packageJson = JSON.stringify({ type: "module" });
const tsconfigRoot = readTsConfig(
  path.resolve(__dirname, "../packages/type-graphql/tsconfig.esm.json"),
);
const tsconfigExamples = readTsConfig(path.resolve(__dirname, "../examples/tsconfig.esm.json"));
const packageJsonRoot = path.resolve(`${tsconfigRoot.options.outDir}/package.json`);
const packagesJsonExamples = tsconfigExamples.raw.include.map(include =>
  path.resolve(`${tsconfigExamples.options.outDir}/${include}/package.json`),
);
const argv = yargs(hideBin(process.argv))
  .strict()
  .env("TYPE_GRAPHQL")
  .usage("Package.json\n\nUsage: $0 [options]")
  .example([
    [`$0 --on ${ANALYZE.ROOT}`, `Analyze '${ANALYZE.ROOT}'`],
    [
      `$0 --on ${ANALYZE.ROOT} ${ANALYZE.EXAMPLES}`,
      `Analyze '${ANALYZE.ROOT}' and '${ANALYZE.EXAMPLES}'`,
    ],
  ])
  .option("on", {
    type: "array",
    default: [] as ANALYZE[],
    requiresArg: true,
    choices: [ANALYZE.ROOT, ANALYZE.EXAMPLES],
    description: "Analysis to be performed",
  })
  .check(({ on }) => {
    if (on.length === 0) {
      throw new Error(`Empty analysis`);
    }

    return true;
  })
  .parseSync();

// tsconfig.esm.json
if (argv.on.includes(ANALYZE.ROOT)) {
  writePackageJson(packageJsonRoot, packageJson);
}

// examples/tsconfig.esm.json
if (argv.on.includes(ANALYZE.EXAMPLES)) {
  for (const packageJsonExamples of packagesJsonExamples) {
    writePackageJson(packageJsonExamples, packageJson);
  }
}
