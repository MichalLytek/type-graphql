---
title: Installation
---

Before getting started with TypeGraphQL we need to install some additional dependencies and properly configure TypeScript configuration for our project.

## Installation

1. Install module:
```
npm i type-graphql
```

2. `reflect-metadata` shim is required:
```
npm i reflect-metadata
```

and make sure to import it on top of your entry file (before you use/import `type-graphql` or your resolvers):
```ts
import "reflect-metadata";
```

## TypeScript configuration

3. Its important to set these options in `tsconfig.json` file of your project:
```js
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

4. `TypeGraphQL` is designed to work with Node.js 6, 8 and latest stable. It uses features from ES7 (ES2016) so you should set your `tsconfig.json` appropriately:
```js
{
  "target": "es2016" // or newer if your node.js version supports this
}
```

5. Due to using `graphql-subscription` dependency that rely on an `AsyncIterator`, you may also have to provide the `esnext.asynciterable` to the `lib` option:
```js
{
  "lib": ["es2016", "esnext.asynciterable"]
}
```

All in all, the minimal `tsconfig.json` file example looks like this:
```js
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
