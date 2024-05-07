---
title: ECMAScript Modules
id: version-2.0.0-beta.3-esm
original_id: esm
---

Since `v2.0.0` release, TypeGraphQL is compatible with ECMAScript modules.

Thanks to this, we can `import` the `type-graphql` package in the ESM projects without any hassle.

## TypeScript configuration

It's important to properly configure the project, so that it uses ESM correctly:

- the `module` options should be set to `ES2020/ES2022/ESNext`
- for the NodeJS apps, we should set `moduleResolution` to `"node16"`

All in all, the `tsconfig.json` file should looks like this:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "es2021",
    "module": "es2020",
    "moduleResolution": "node16",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Package.json configuration

It is also important to set `type` option to `"module"` in your `package.json` file:

```json title="package.json"
{
  "type": "module"
}
```

## Imports

Apart from using `import` syntax, your local imports have to use the `.js` suffix, e.g.:

```ts
import { MyResolver } from "./resolvers/MyResolver.js";
```
