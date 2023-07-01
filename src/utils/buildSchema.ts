import path from "node:path";
import type { GraphQLSchema } from "graphql";
import type { SchemaGeneratorOptions } from "@/schema/schema-generator";
import { SchemaGenerator } from "@/schema/schema-generator";
import type { NonEmptyArray } from "@/typings";
import type { PrintSchemaOptions } from "./emitSchemaDefinitionFile";
import {
  defaultPrintSchemaOptions,
  emitSchemaDefinitionFile,
  emitSchemaDefinitionFileSync,
} from "./emitSchemaDefinitionFile";

interface EmitSchemaFileOptions extends Partial<PrintSchemaOptions> {
  path?: string;
}

function getEmitSchemaDefinitionFileOptions(buildSchemaOptions: BuildSchemaOptions): {
  schemaFileName: string;
  printSchemaOptions: PrintSchemaOptions;
} {
  const defaultSchemaFilePath = path.resolve(process.cwd(), "schema.graphql");

  return {
    schemaFileName:
      // eslint-disable-next-line no-nested-ternary
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

function loadResolvers(options: BuildSchemaOptions): Function[] {
  // Additional runtime check as it should be covered by the `NonEmptyArray` type guard
  if (options.resolvers.length === 0) {
    throw new Error("Empty `resolvers` array property found in `buildSchema` options!");
  }

  return options.resolvers as Function[];
}

export interface BuildSchemaOptions extends Omit<SchemaGeneratorOptions, "resolvers"> {
  /** Array of resolvers classes to resolver files */
  resolvers: NonEmptyArray<Function>;
  /**
   * Path to the file to where emit the schema
   * or config object with print schema options
   * or `true` for the default `./schema.graphql` one
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
