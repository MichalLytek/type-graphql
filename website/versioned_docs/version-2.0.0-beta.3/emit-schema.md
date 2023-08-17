---
title: Emitting the schema SDL
id: version-2.0.0-beta.3-emit-schema
original_id: emit-schema
---

TypeGraphQL's main feature is creating the schema using only TypeScript classes and decorators. However, there might be a need for the schema to be printed into a `schema.graphql` file and there are plenty of reasons for that. Mainly, the schema SDL file is needed for GraphQL ecosystem tools that perform client-side queries autocompletion and validation. Some developers also may want to use it as a kind of snapshot for detecting schema regression or they just prefer to read the SDL file to explore the API instead of reading the complicated TypeGraphQL-based app code, navigating through the GraphiQL or GraphQL Playground. To accomplish this demand, TypeGraphQL allows you to create a schema definition file in two ways.

The first one is to generate it automatically on every build of the schema - just pass `emitSchemaFile: true` to the `buildSchema` options in order to emit the `schema.graphql` in the root of the project's working directory. You can also manually specify the path and the file name where the schema definition should be written or even specify `PrintSchemaOptions` to configure the look and format of the schema definition.

```ts
const schema = await buildSchema({
  resolvers: [ExampleResolver],
  // Automatically create `schema.graphql` file with schema definition in project's working directory
  emitSchemaFile: true,
  // Or create the file with schema in selected path
  emitSchemaFile: path.resolve(__dirname, "__snapshots__/schema/schema.graphql"),
  // Or pass a config object
  emitSchemaFile: {
    path: __dirname + "/schema.graphql",
    sortedSchema: false, // By default the printed schema is sorted alphabetically
  },
});
```

The second way to emit the schema definition file is by doing it programmatically. We would use the `emitSchemaDefinitionFile` function (or it's sync version `emitSchemaDefinitionFileSync`) and pass in the path, along with the schema object. We can use this among others as part of a testing script that checks if the snapshot of the schema definition is correct or to automatically generate it on every file change during local development.

```ts
import { emitSchemaDefinitionFile } from "type-graphql";

// ...
hypotheticalFileWatcher.watch("./src/**/*.{resolver,type,input,arg}.ts", async () => {
  const schema = getSchemaNotFromBuildSchemaFunction();
  await emitSchemaDefinitionFile("/path/to/folder/schema.graphql", schema);
});
```

### Emit schema with custom directives

Currently TypeGraphQL does not directly support emitting the schema with custom directives due to `printSchema` function limitations from `graphql-js`.

If we want the custom directives to appear in the generated schema definition file we have to create a custom function that use a third-party `printSchema` function.

Below there is an example that uses the `printSchemaWithDirectives` function from [`@graphql-tools/utils`](https://www.graphql-tools.com/docs/api/modules/utils):

```ts
import { GraphQLSchema, lexicographicSortSchema } from "graphql";
import { printSchemaWithDirectives } from "@graphql-tools/utils";
import { outputFile } from "type-graphql/dist/helpers/filesystem";

export async function emitSchemaDefinitionWithDirectivesFile(
  schemaFilePath: string,
  schema: GraphQLSchema,
): Promise<void> {
  const schemaFileContent = printSchemaWithDirectives(lexicographicSortSchema(schema));
  await outputFile(schemaFilePath, schemaFileContent);
}
```

The usage of `emitSchemaDefinitionWithDirectivesFile` function is the same as with standard `emitSchemaDefinitionFile`:

```ts
const schema = await buildSchema(/*...*/);

await emitSchemaDefinitionWithDirectivesFile("/path/to/folder/schema.graphql", schema);
```
