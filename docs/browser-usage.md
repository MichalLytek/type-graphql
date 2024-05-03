---
title: Browser usage
---

## Using classes in a client app

Sometimes we might want to use the classes we've created and annotated with TypeGraphQL decorators, in our client app that works in the browser. For example, reusing the args or input classes with `class-validator` decorators or the object type classes with some helpful custom methods.

Since TypeGraphQL is a Node.js framework, it doesn't work in a browser environment, so we may quickly get an error, e.g. `ERROR in ./node_modules/fs.realpath/index.js` or `utils1_promisify is not a function`, while trying to build our app e.g. with Webpack. To correct this, we have to configure bundler or compiler to use the decorator shim instead of the normal module.

The steps to accomplish this are different, depending on the framework, bundler or compiler we use.
However, in all cases, using shim makes our bundle much lighter as we don't need to embed the whole TypeGraphQL library code in our app.

## CRA and similar

We simply add this plugin code to our webpack config:

```js
module.exports = {
  // ... Rest of Webpack configuration
  plugins: [
    // ... Other existing plugins
    new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
      resource.request = resource.request.replace(/type-graphql/, "type-graphql/shim");
    }),
  ];
}
```

In case of cypress, we can adapt the same webpack config trick just by applying the [cypress-webpack-preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor) plugin.

## Angular and similar

In some TypeScript projects, like the ones using Angular, which AoT compiler requires that a full `*.ts` file is provided instead of just a `*.js` and `*.d.ts` files, to use this shim we have to simply set up our TypeScript configuration in `tsconfig.json` to use this file instead of a normal TypeGraphQL module:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "type-graphql": ["node_modules/type-graphql/build/typings/shim.ts"]
    }
  }
}
```

## Next.js and similar

When using the shim with Next.js as a dedicated frontend server be aware that Next has pre-renders on the server. This means that in development mode the `webpack: {}` config in `next.config.js` is skipped and full `type-graphql` is bundled. But we still need to handle some webpack rewiring for the client bundling which still happens with webpack both in development and in production mode.

The easiest way is to accomplish this is also done in `tsconfig.json` - add the same keys like in the example before to `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "type-graphql": ["node_modules/type-graphql/build/typings/shim.ts"]
    }
  }
}
```

Then, `npm install -D tsconfig-paths` and enable it with `NODE_OPTIONS="-r tsconfig-paths/register"` in our environment variables setup.
