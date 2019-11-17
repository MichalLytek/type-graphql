---
title: Emitting the schema SDL
---

TypeGraphQL's main feature is creating the schema using only TypeScript classes and decorators. However, there might be a need for the schema to be printed into a `schema.gql` file and there are plenty of reasons for that. Mainly, the schema SDL file is needed for GraphQL ecosystem tools that perform client-side queries autocompletion and validation. Some developers also may want to use it as a kind of snapshot for detecting schema regression or they just prefer to read the SDL file to explore the API instead of reading the complicated TypeGraphQL-based app code, navigating through the GraphiQL or GraphQL Playground. To accomplish this demand, TypeGraphQL allows you to create a schema definition file in two ways.

The first one is to generate it automatically on every build of the schema - just pass `emitSchemaFile: true` to the `buildSchema` options in order to emit the `schema.gql` in the root of the project's working directory. You can also manually specify the path and the file name where the schema definition should be written or even specify `PrintSchemaOptions` to configure the look and format of the schema definition.

```typescript
const schema = await buildSchema({
  resolvers: [ExampleResolver],
  // automatically create `schema.gql` file with schema definition in project's working directory
  emitSchemaFile: true,
  // or create the file with schema in selected path
  emitSchemaFile: path.resolve(__dirname, "__snapshots__/schema/schema.gql"),
  // or pass a config object
  emitSchemaFile: {
    path: __dirname + "/schema.gql",
    commentDescriptions: true,
    sortedSchema: false, // by default the printed schema is sorted alphabetically
  },
});
```

The second way to emit the schema definition file is by doing it programmatically. We would use the `emitSchemaDefinitionFile` function (or it's sync version `emitSchemaDefinitionFileSync`) and pass in the path, along with the schema object. We can use this among others as part of a testing script that checks if the snapshot of the schema definition is correct or to automatically generate it on every file change during local development.

```typescript
import { emitSchemaDefinitionFile } from "type-graphql";
// ...
hypotheticalFileWatcher.watch("./src/**/*.{resolver,type,input,arg}.ts", async () => {
  const schema = getSchemaNotFromBuildSchemaFunction();
  await emitSchemaDefinitionFile("/path/to/folder/schema.gql", schema);
});
```
