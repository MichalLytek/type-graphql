---
title: Browser usage
---

## Using classes in a client app

Sometimes we might want to use the classes we've created and annotated with TypeGraphQL decorators, in our client app that works in the browser. For example, reusing the args or input classes with `class-validator` decorators or the object type classes with some helpful custom methods.

Since TypeGraphQL is a Node.js framework, it doesn't work in a browser environment, so we may quickly get an error, e.g. `ERROR in ./node_modules/fs.realpath/index.js`, while trying to build our app with Webpack. To correct this, we have to configure Webpack to use the decorator shim instead of the normal module. We simply add this plugin code to our webpack config:

```js
plugins: [
  // ...here are any other existing plugins that we already have
  new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
    resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim");
  }),
];
```

Thanks to this, our bundle will be much lighter as we don't need to embed the whole TypeGraphQL library code in our app.
