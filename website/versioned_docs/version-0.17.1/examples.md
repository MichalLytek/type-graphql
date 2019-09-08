---
title: Examples
sidebar_label: List of examples
id: version-0.17.1-examples
original_id: examples
---

On the [GitHub repository](https://github.com/MichalLytek/type-graphql) there are a few simple examples of how to use different TypeGraphQL features and how well they integrate with 3rd party libraries.

All examples have an `examples.gql` file with sample queries/mutations/subscriptions that we can execute.

## Basics

- [Simple usage of fields, basic types and resolvers](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/simple-usage)

## Advanced

- [Enums and unions](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/enums-and-unions)
- [Subscriptions (simple)](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/simple-subscriptions)
- [Subscriptions (using Redis)](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/redis-subscriptions)
- [Interfaces](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/interfaces-inheritance)

## Features usage

- [Dependency injection (IoC container)](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/using-container)
  - [scoped container](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/using-scoped-container)
- [Authorization](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/authorization)
- [Validation](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/automatic-validation)
- [Types inheritance](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/interfaces-inheritance)
- [Resolvers inheritance](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/resolvers-inheritance)
- [Generic types](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/generic-types)
- [Middlewares](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/middlewares)

## 3rd party libs integration

- [TypeORM (manual, synchronous) \*](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/typeorm-basic-usage)
- [TypeORM (automatic, lazy relations) \*](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/typeorm-lazy-relations)
- [Typegoose](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/typegoose)
- [Apollo Engine (Apollo Cache Control) \*\*](https://github.com/MichalLytek/type-graphql/tree/v0.17.1/examples/apollo-engine)

_\* Note that we need to edit the TypeORM example's `index.ts` with the credentials of our local database_

_\*\* Note that we need to provide an `APOLLO_ENGINE_API_KEY` env variable with our own API key_
