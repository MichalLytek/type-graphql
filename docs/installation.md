---
title: Installation
---

Before getting started with TypeGraphQL we need to install some additional dependencies and properly configure the TypeScript configuration for our project.

> #### Prerequisites
>
> Before we begin, we must make sure our development environment includes Node.js and npm.

## Packages installation

First, we have to install the main package, as well as [`graphql-js`](https://github.com/graphql/graphql-js) (and it's typings) which is a peer dependency of TypeGraphQL:

```sh
npm i graphql type-graphql
```

Also, the `reflect-metadata` shim is required to make the type reflection work:

```sh
npm i reflect-metadata
```

We must ensure that it is imported at the top of our entry file (before we use/import `type-graphql` or our resolvers):

```typescript
import "reflect-metadata";
```

## TypeScript configuration

It's important to set these options in the `tsconfig.json` file of our project:

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

`TypeGraphQL` is designed to work with Node.js LTS (8, 10) and the latest stable releases. It uses features from ES7 (ES2016) so we should set our `tsconfig.json` file appropriately:

```js
{
  "target": "es2016" // or newer if your node.js version supports this
}
```

Due to using the `graphql-subscription` dependency that relies on an `AsyncIterator`, we may also have to provide the `esnext.asynciterable` to the `lib` option:

```json
{
  "lib": ["es2016", "esnext.asynciterable"]
}
```

All in all, the minimal `tsconfig.json` file example looks like this:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "lib": ["es2016", "esnext.asynciterable"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```
