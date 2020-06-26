---
title: Browser usage
---

## Using classes in a client app

Sometimes we might want to use the classes we've created and annotated with TypeGraphQL decorators, in our client app that works in the browser. For example, reusing the args or input classes with `class-validator` decorators or the object type classes with some helpful custom methods.

Since TypeGraphQL is a Node.js framework, it doesn't work in a browser environment, so we may quickly get an error, e.g. `ERROR in ./node_modules/fs.realpath/index.js`, while trying to build our app with Webpack. To correct this, we have to configure Webpack to use the decorator shim instead of the normal module. We simply add this plugin code to our webpack config:

```js
module.exports = {
  // ... the rest of the webpack config
  plugins: [
    // ... here are any other existing plugins that we already have
    new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
      resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim.js");
    }),
  ];
}
```

However, in some TypeScript projects like the ones using Angular, which AoT compiler requires that a full `*.ts` file is provided instead of just a `*.js` and `*.d.ts` files, to use this shim we have to simply set up our TypeScript configuration in `tsconfig.json` to use this file instead of a normal TypeGraphQL module:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "type-graphql": ["./node_modules/type-graphql/dist/browser-shim.ts"]
    }
  }
}
```

Thanks to this, our bundle will be much lighter as we don't need to embed the whole TypeGraphQL library code in our app.

## Usage with Cypress Tests

If you're importing a module into your test which includes a type-graphql decorator you need to tell Cypress's webpack config to shim type-graph.

First `yarn add --dev webpack @cypress/webpack-preprocessor ts-loader`. Note: You might already have one or more of these installed - delete as required.

Then in `cypress/plugins/index.js` just add this to your config:

```js
module.exports = (on, config) => {
  const { NormalModuleReplacementPlugin } = require('webpack')
  const options = {
    webpackOptions: {
      plugins: [
        new NormalModuleReplacementPlugin(/type-graphql$/, resource => {
          resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim.js");
        }),
      ];
    },
  }
  on('file:preprocessor', wp(options));
}
```
