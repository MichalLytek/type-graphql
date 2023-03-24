import { GraphQLSchema } from "graphql";
import path from "path";

import { SchemaGenerator, SchemaGeneratorOptions } from "../schema/schema-generator";
import {
  emitSchemaDefinitionFileSync,
  emitSchemaDefinitionFile,
  defaultPrintSchemaOptions,
  PrintSchemaOptions,
} from "./emitSchemaDefinitionFile";
import { NonEmptyArray } from "../interfaces/NonEmptyArray";

interface EmitSchemaFileOptions extends Partial<PrintSchemaOptions> {
  path?: string;
}

export interface BuildSchemaOptions extends Omit<SchemaGeneratorOptions, "resolvers"> {
  /** Array of resolvers classes to resolver files */
  resolvers: NonEmptyArray<Function>;
  /**
   * Path to the file to where emit the schema
   * or config object with print schema options
   * or `true` for the default `./schema.gql` one
   */
  emitSchemaFile?: string | boolean | EmitSchemaFileOptions;
}

export async function buildSchema(options: BuildSchemaOptions): Promise<GraphQLSchema> {
  const resolvers = loadResolvers(options);
  const schema = SchemaGenerator.generateFromMetadata({ ...options, resolvers });
  if (options.emitSchemaFile) {
    const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
    await emitSchemaDefinitionFile(schemaFileName, schema, printSchemaOptions);
  }
  return schema;
}

export function buildSchemaSync(options: BuildSchemaOptions): GraphQLSchema {
  const resolvers = loadResolvers(options);
  const schema = SchemaGenerator.generateFromMetadata({ ...options, resolvers });
  if (options.emitSchemaFile) {
    const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
    emitSchemaDefinitionFileSync(schemaFileName, schema, printSchemaOptions);
  }
  return schema;
}

function loadResolvers(options: BuildSchemaOptions): Function[] {
  // additional runtime check as it should be covered by the `NonEmptyArray` type guard
  if (options.resolvers.length === 0) {
    throw new Error("Empty `resolvers` array property found in `buildSchema` options!");
  }
  return options.resolvers as Function[];
}

function getEmitSchemaDefinitionFileOptions(buildSchemaOptions: BuildSchemaOptions): {
  schemaFileName: string;
  printSchemaOptions: PrintSchemaOptions;
} {
  const defaultSchemaFilePath = path.resolve(process.cwd(), "schema.gql");
  return {
    schemaFileName:
      typeof buildSchemaOptions.emitSchemaFile === "string"
        ? buildSchemaOptions.emitSchemaFile
        : typeof buildSchemaOptions.emitSchemaFile === "object"
        ? buildSchemaOptions.emitSchemaFile.path || defaultSchemaFilePath
        : defaultSchemaFilePath,
    printSchemaOptions:
      typeof buildSchemaOptions.emitSchemaFile === "object"
        ? { ...defaultPrintSchemaOptions, ...buildSchemaOptions.emitSchemaFile }
        : defaultPrintSchemaOptions,
  };
}
