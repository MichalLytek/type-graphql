#!/usr/bin/env ts-node

import fs from "node:fs";
import path from "node:path";
import expect from "expect";
import typescript from "typescript";

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
const packageJsonRoot = path.resolve(`${tsconfigRoot.options.outDir}/package.json`);

writePackageJson(packageJsonRoot, packageJson);
