import { writeFile, writeFileSync, mkdirSync, existsSync } from "fs";
import { GraphQLSchema, printSchema } from "graphql";
import { Options as PrintSchemaOptions } from "graphql/utilities/schemaPrinter";
import * as path from "path";

export const defaultSchemaFilePath = path.resolve(process.cwd(), "schema.gql");

export const defaultPrintSchemaOptions: PrintSchemaOptions = { commentDescriptions: false };

const generatedSchemaWarning = /* graphql */ `\
# -----------------------------------------------
# !!! THIS FILE WAS GENERATED BY TYPE-GRAPHQL !!!
# !!!   DO NOT MODIFY THIS FILE BY YOURSELF   !!!
# -----------------------------------------------

`;

function mkdirRecursive(targetPath: string) {
  path
    .parse(path.resolve(targetPath))
    .dir.split(path.sep)
    .reduce((previousPath, folder) => {
      const currentPath = path.join(previousPath, folder, path.sep);
      if (!existsSync(currentPath)) {
        mkdirSync(currentPath);
      }
      return currentPath;
    }, "");
}

export function emitSchemaDefinitionFileSync(
  schemaFilePath: string,
  schema: GraphQLSchema,
  options: PrintSchemaOptions = defaultPrintSchemaOptions,
) {
  const schemaFileContent = generatedSchemaWarning + printSchema(schema, options);
  mkdirRecursive(schemaFilePath);
  writeFileSync(schemaFilePath, schemaFileContent);
}

export async function emitSchemaDefinitionFile(
  schemaFilePath: string,
  schema: GraphQLSchema,
  options: PrintSchemaOptions = defaultPrintSchemaOptions,
) {
  const schemaFileContent = generatedSchemaWarning + printSchema(schema, options);
  return new Promise<void>((resolve, reject) => {
    mkdirRecursive(schemaFilePath);
    writeFile(schemaFilePath, schemaFileContent, err => (err ? reject(err) : resolve()));
  });
}
