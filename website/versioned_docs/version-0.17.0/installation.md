---
title: Installation
id: version-0.17.0-installation
original_id: installation
---

Before getting started with TypeGraphQL we need to install some additional dependencies and properly configure TypeScript configuration for our project.

> #### Prerequisites
>
> Before you begin, make sure your development environment includes Node.js and npm.

## Packages installation

First, you have to install the main package, as well as the [`graphql-js`](https://github.com/graphql/graphql-js) (and it's typings) which is a peer dependency of TypeGraphQL:

```sh
npm i graphql @types/graphql type-graphql
```

Also, the `reflect-metadata` shim is required to make the type reflection works:

```sh
npm i reflect-metadata
```

Please make sure to import it on top of your entry file (before you use/import `type-graphql` or your resolvers):

```typescript
import "reflect-metadata";
```

## TypeScript configuration

It's important to set these options in `tsconfig.json` file of your project:

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

`TypeGraphQL` is designed to work with Node.js 6, 8 and latest stable. It uses features from ES7 (ES2016) so you should set your `tsconfig.json` appropriately:

```js
{
  "target": "es2016" // or newer if your node.js version supports this
}
```

Due to using `graphql-subscription` dependency that rely on an `AsyncIterator`, you may also have to provide the `esnext.asynciterable` to the `lib` option:

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
