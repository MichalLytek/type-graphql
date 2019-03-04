import { writeFile, writeFileSync, mkdir, mkdirSync, existsSync } from "fs";
import { GraphQLSchema, printSchema } from "graphql";
import { Options as PrintSchemaOptions } from "graphql/utilities/schemaPrinter";
import * as path from "path";

export const defaultPrintSchemaOptions: PrintSchemaOptions = { commentDescriptions: false };

const generatedSchemaWarning = /* graphql */ `\
# -----------------------------------------------
# !!! THIS FILE WAS GENERATED BY TYPE-GRAPHQL !!!
# !!!   DO NOT MODIFY THIS FILE BY YOURSELF   !!!
# -----------------------------------------------

`;

function parsePath(targetPath: string) {
  const directoryArray: string[] = [];
  path
    .parse(path.resolve(targetPath))
    .dir.split(path.sep)
    .reduce((previous, next) => {
      const directory = path.join(previous, next);
      directoryArray.push(directory);
      return path.join(directory);
    });
  return directoryArray;
}

function mkdirRecursiveSync(targetPath: string) {
  const directoryArray = parsePath(targetPath);
  directoryArray.forEach(directory => {
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
  });
}

function mkdirRecursive(targetPath: string) {
  const directoryArray = parsePath(targetPath);
  return directoryArray
    .map(directory => {
      return () =>
        new Promise((resolve, reject) => {
          mkdir(directory, err => {
            if (err && err.code !== "EEXIST") {
              reject(err);
            } else {
              resolve();
            }
          });
        });
    })
    .reduce((promise, func) => {
      return promise.then(() => func());
    }, Promise.resolve({}));
}

export function emitSchemaDefinitionFileSync(
  schemaFilePath: string,
  schema: GraphQLSchema,
  options: PrintSchemaOptions = defaultPrintSchemaOptions,
) {
  const schemaFileContent = generatedSchemaWarning + printSchema(schema, options);
  mkdirRecursiveSync(schemaFilePath);
  writeFileSync(path.resolve(schemaFilePath), schemaFileContent);
}

export async function emitSchemaDefinitionFile(
  schemaFilePath: string,
  schema: GraphQLSchema,
  options: PrintSchemaOptions = defaultPrintSchemaOptions,
) {
  const schemaFileContent = generatedSchemaWarning + printSchema(schema, options);
  return new Promise<void>((resolve, reject) => {
    mkdirRecursive(schemaFilePath).then(() =>
      writeFile(path.resolve(schemaFilePath), schemaFileContent, err =>
        err ? reject(err) : resolve(),
      ),
    );
  });
}
