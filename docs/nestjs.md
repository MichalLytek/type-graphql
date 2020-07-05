---
title: NestJS Integration
sidebar_label: NestJS
---

TypeGraphQL provides some basic integration with NestJS by the [`typegraphql-nestjs` package](https://www.npmjs.com/package/typegraphql-nestjs).

It allows to use TypeGraphQL features while integrating with NestJS modules system and its dependency injector.

## Overview

The usage is similar to the official `@nestjs/graphql` package.
First you need to register your resolver classes in `providers` of the `@Module` :

```typescript
@Module({
  providers: [RecipeResolver, RecipeService],
})
export default class RecipeModule {}
```

Then you need to register the TypeGraphQL module in your root module - you can pass there all standard `buildSchema` options:

```typescript
@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      emitSchemaFile: true,
      authChecker,
      dateScalarMode: "timestamp",
      context: ({ req }) => ({ currentUser: req.user }),
    }),
    RecipeModule,
  ],
})
export default class AppModule {}
```

And your `AppModule` is ready to use like with a standard NestJS approach.

### Caveats

For now, this basic integration doesn't support other NestJS features like guards, interceptors, filters and pipes.
To achieve the same goals, you can use standard TypeGraphQL equivalents - middlewares, custom decorators, built-in authorization and validation.

## Documentation and examples

You can find some examples and more detailed info about the installation and the usage [in the separate GitHub repository](https://github.com/MichalLytek/typegraphql-nestjs/).
