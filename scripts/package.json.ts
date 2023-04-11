#!/usr/bin/env ts-node

import fs from "node:fs";
import path from "node:path";
import expect from "expect";
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

const packageJson = JSON.stringify({ type: "module" });
const tsconfigRoot = readTsConfig(path.resolve(__dirname, "../tsconfig.esm.json"));
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
    ["$0"],
    ["$0 --skip-root", "Skip 'tsconfig.esm.json'"],
    ["$0 --skip-examples", "Skip 'examples/tsconfig.esm.json'"],
  ])
  .option("skip-root", { type: "boolean", default: false, description: "Skip 'tsconfig.esm.json'" })
  .option("skip-examples", {
    type: "boolean",
    default: false,
    description: "Skip 'examples/tsconfig.esm.json'",
  })
  .parseSync();

// tsconfig.esm.json
if (!argv.skipRoot) {
  writePackageJson(packageJsonRoot, packageJson);
}

// examples/tsconfig.esm.json
if (!argv.skipExamples) {
  for (const packageJsonExamples of packagesJsonExamples) {
    writePackageJson(packageJsonExamples, packageJson);
  }
}
