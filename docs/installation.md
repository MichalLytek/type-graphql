---
title: Installation
---

Before getting started with TypeGraphQL we need to install some additional dependencies and properly configure the TypeScript configuration for our project.

> **Prerequisites**
>
> Before we begin, we must make sure our development environment includes Node.js and npm.

## Packages installation

First, we have to install the main package, as well as [`graphql-js`](https://github.com/graphql/graphql-js) and [`graphql-scalars`](https://github.com/urigo/graphql-scalars) which are peer dependencies of TypeGraphQL:

```sh
npm install graphql graphql-scalars type-graphql
```

Also, the `Reflect.metadata()` shim is required to make the type reflection work:

```sh
npm install reflect-metadata
# or
npm install core-js
```

We must ensure that it is imported at the top of our entry file (before we use/import `type-graphql` or our resolvers):

```ts
import "reflect-metadata";
// or
import "core-js/features/reflect";
```

## TypeScript configuration

It's important to set these options in the `tsconfig.json` file of our project:

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

`TypeGraphQL` is designed to work with Node.js LTS and the latest stable releases. It uses features from ES2021 so we should set our `tsconfig.json` file appropriately:

```js
{
  "target": "es2021" // Or newer if Node.js version supports it
}
```

All in all, the minimal `tsconfig.json` file example looks like this:

```json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```
