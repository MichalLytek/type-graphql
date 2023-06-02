---
title: Examples
sidebar_label: List of examples
---

On the [GitHub repository](https://github.com/MichalLytek/type-graphql) there are a few simple [`examples`](https://github.com/MichalLytek/type-graphql/tree/master/examples) of how to use different `TypeGraphQL` features and how well they integrate with 3rd party libraries.

To run an example, simply go to the subdirectory (e.g. `cd ./simple-usage`), and then start the server (`npx ts-node ./index.ts`).

Each subdirectory contains a `examples.graphql` file with predefined GraphQL queries/mutations/subscriptions that you can use in Apollo Studio (<http://localhost:4000>) and play with them by modifying their shape and data.

## Basics

- [Simple usage of fields, basic types and resolvers](https://github.com/MichalLytek/type-graphql/tree/master/examples/simple-usage)
- [ECMAScript modules (ESM)](https://github.com/MichalLytek/type-graphql/tree/master/examples/esm)

## Advanced

- [Enums and unions](https://github.com/MichalLytek/type-graphql/tree/master/examples/enums-and-unions)
- [Subscriptions (simple)](https://github.com/MichalLytek/type-graphql/tree/master/examples/simple-subscriptions)
- [Subscriptions (using Redis) \*\*](https://github.com/MichalLytek/type-graphql/tree/master/examples/redis-subscriptions)
- [Interfaces](https://github.com/MichalLytek/type-graphql/tree/master/examples/interfaces-inheritance)
- [Extensions (metadata)](https://github.com/MichalLytek/type-graphql/tree/master/examples/extensions)

## Features usage

- [Dependency injection (IoC container)](https://github.com/MichalLytek/type-graphql/tree/master/examples/using-container)
  - [Scoped containers](https://github.com/MichalLytek/type-graphql/tree/master/examples/using-scoped-container)
- [Authorization](https://github.com/MichalLytek/type-graphql/tree/master/examples/authorization)
- [Validation](https://github.com/MichalLytek/type-graphql/tree/master/examples/automatic-validation)
  - [Custom validation](https://github.com/MichalLytek/type-graphql/tree/master/examples/custom-validation)
- [Types inheritance](https://github.com/MichalLytek/type-graphql/tree/master/examples/interfaces-inheritance)
- [Resolvers inheritance](https://github.com/MichalLytek/type-graphql/tree/master/examples/resolvers-inheritance)
- [Generic types](https://github.com/MichalLytek/type-graphql/tree/master/examples/generic-types)
- [Mixin classes](https://github.com/MichalLytek/type-graphql/tree/master/examples/mixin-classes)
- [Middlewares and Custom Decorators](https://github.com/MichalLytek/type-graphql/tree/master/examples/middlewares-custom-decorators)
- [Query complexity](https://github.com/MichalLytek/type-graphql/tree/master/examples/query-complexity)

## 3rd party libs integration

- [TypeORM (manual, synchronous) \*](https://github.com/MichalLytek/type-graphql/tree/master/examples/typeorm-basic-usage)
- [TypeORM (automatic, lazy relations) \*](https://github.com/MichalLytek/type-graphql/tree/master/examples/typeorm-lazy-relations)
- [MikroORM \*](https://github.com/MichalLytek/type-graphql/tree/master/examples/mikro-orm)
- [Typegoose \*](https://github.com/MichalLytek/type-graphql/tree/master/examples/typegoose)
- [Apollo federation](https://github.com/MichalLytek/type-graphql/tree/master/examples/apollo-federation)
- [Apollo Cache Control](https://github.com/MichalLytek/type-graphql/tree/master/examples/apollo-cache)
- [Apollo Client local state](https://github.com/MichalLytek/type-graphql/tree/master/examples/apollo-client)
- [GraphQL Scalars](https://github.com/MichalLytek/type-graphql/tree/master/examples/graphql-scalars)
- [TSyringe](https://github.com/MichalLytek/type-graphql/tree/master/examples/tsyringe)

_\* Note that we need to provide the environment variable `DATABASE_URL` with connection parameters to your local database_ \
_\*\* Note that we need to provide the environment variable `REDIS_URL` with connection parameters to your local Redis instance_
