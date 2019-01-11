---
title: Emitting schema SDL
---

The TypeGraphQL main feature is creating schema using only TypeScript's classes and decorators. However, sometimes we might need the schema to be printed into a `schema.gql` file and there are a plenty of reasons for that. Mainly, schema SDL file is needed for GraphQL ecosystem tools that perform client-side queries autocompletion and validation. Some developers also may want to use it as a kinda snapshot for detecting schema regression or they just prefer to read the SDL file to explore the API instead of reading the complicated TypeGraphQL-based app code, navigating through GraphiQL or GraphQL Playground. To accomplish this demand, TypeGraphQL allows you to create a schema definition file in two ways.

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
  },
});
```

The second way to emit schema definition file is by doing it manually in a programmatic way. All you need to do is to use `emitSchemaDefinitionFile` function (or it's sync version `emitSchemaDefinitionFileSync`) and pass the selected path to it, along with the schema object. You can use this i.a. as part of a testing script that checks if the snapshot of the schema definition is correct or to automatically generate it on every file change during local development.

```typescript
import { emitSchemaDefinitionFile } from "type-graphql";
// ...
hypotheticalFileWatcher.watch("./src/**/*.{resolver,type,input,arg}.ts", async () => {
  const schema = getSchemaNotFromBuildSchemaFunction();
  await emitSchemaDefinitionFile("/path/to/folder/schema.gql", schema);
});
```
