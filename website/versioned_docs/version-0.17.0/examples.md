---
title: Examples
sidebar_label: List of examples
id: version-0.17.0-examples
original_id: examples
---

On the [GitHub repository](https://github.com/MichalLytek/type-graphql) there are a few simple examples showing how to use different TypeGraphQL features and how well it integrates with 3rd party libraries.

All examples has a `examples.gql` file with sample queries/mutations/subscriptions that you can execute.

## Basics

- [Simple usage of fields, basic types and resolvers](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/simple-usage)

## Advanced

- [Enums and unions](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/enums-and-unions)
- [Subscriptions (simple)](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/simple-subscriptions)
- [Subscriptions (using Redis)](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/redis-subscriptions)
- [Interfaces](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/interfaces-inheritance)

## Features usage

- [Dependency injection (IoC container)](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/using-container)
  - [scoped container](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/using-scoped-container)
- [Authorization](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/authorization)
- [Validation](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/automatic-validation)
- [Types inheritance](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/interfaces-inheritance)
- [Resolvers inheritance](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/resolvers-inheritance)
- [Generic types](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/generic-types)
- [Middlewares](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/middlewares)

## 3rd party libs integration

- [TypeORM (manual, synchronous) \*](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/typeorm-basic-usage)
- [TypeORM (automatic, lazy relations) \*](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/typeorm-lazy-relations)
- [Apollo Engine (Apollo Cache Control) \*\*](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/apollo-engine)

_\* Note that you need to edit the TypeORM examples `index.ts` with credentials to your local database_

_\*\* Note that you need to provide `APOLLO_ENGINE_API_KEY` env variable with your own API key_
