---
title: Browser usage
---

## Using classes in client app
Sometimes you might want to use the classes, that you've created and annotated with TypeGraphQL decorators, in your client app that works in browser. For example, you may want to reuse the args or input classes with `class-validator` decorators or the object type classes with some helpful custom methods.

As TypeGraphQL is a Node.js framework, it doesn't work in browser environment, so you may quickly got an error, e.g. `ERROR in ./node_modules/fs.realpath/index.js`, while trying to build your app with Webpack. To fix that, you have to configure Webpack to use the decorators shim instead of normal module. All you need is to add this plugin code to your webpack config:
```js
plugins: [
    ..., // here any other existing plugins that you already have
    new webpack.NormalModuleReplacementPlugin(/type-graphql$/, function (result) {
        result.request = result.request.replace(/type-graphql/, "type-graphql/browser-shim");
    }),
]
```

Also, thanks to this your bundle will be much lighter as you don't embedded the whole TypeGraphQL library code in your app.

