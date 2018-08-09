---
title: Examples
sidebar_label: List of examples
---

On the [GitHub repository](https://github.com/19majkel94/type-graphql) there are a few simple examples showing how to use different TypeGraphQL features and how well it integrates with 3rd party libraries.

All examples has a `examples.gql` file with sample queries/mutations/subscriptions that you can execute.

## Basics
- [Simple usage of fields, basic types and resolvers](https://github.com/19majkel94/type-graphql/tree/master/examples/simple-usage)

## Advanced
- [Enums and unions](https://github.com/19majkel94/type-graphql/tree/master/examples/enums-and-unions)
- [Interfaces and types inheritance](https://github.com/19majkel94/type-graphql/tree/master/examples/interfaces-inheritance)
- [Subscriptions (simple)](https://github.com/19majkel94/type-graphql/tree/master/examples/simple-subscriptions)
- [Subscriptions (using Redis)](https://github.com/19majkel94/type-graphql/tree/master/examples/redis-subscriptions)
- [Resolvers inheritance](https://github.com/19majkel94/type-graphql/tree/master/examples/resolvers-inheritance)

## Features usage
- [Dependency injection (IoC container)](https://github.com/19majkel94/type-graphql/tree/master/examples/using-container)
  - [scoped container](https://github.com/19majkel94/type-graphql/tree/master/examples/using-scoped-container)
- [Authorization](https://github.com/19majkel94/type-graphql/tree/master/examples/authorization)
- [Validation](https://github.com/19majkel94/type-graphql/tree/master/examples/automatic-validation)
- [Middlewares](https://github.com/19majkel94/type-graphql/tree/master/examples/middlewares)

## 3rd party libs integration
- [TypeORM (manual, synchronous) *](https://github.com/19majkel94/type-graphql/tree/master/examples/typeorm-basic-usage)
- [TypeORM (automatic, lazy relations) *](https://github.com/19majkel94/type-graphql/tree/master/examples/typeorm-lazy-relations)
- [Apollo Engine (Apollo Cache Control) **](https://github.com/19majkel94/type-graphql/tree/master/examples/apollo-engine)

_* Note that you need to edit the TypeORM examples `index.ts` with credentials to your local database_

_** Note that you need to provide `APOLLO_ENGINE_API_KEY` env variable with your own API key_
