---
title: Examples
sidebar_label: List of examples
---

On the [GitHub repository](https://github.com/MichalLytek/type-graphql) there are a few simple [`examples`](https://github.com/MichalLytek/type-graphql/tree/master/examples) of how to use different `TypeGraphQL` features and how well they integrate with 3rd party libraries.

All examples have an `examples.graphql` file with sample queries/mutations/subscriptions that we can execute.

## Basics

- [Simple usage of fields, basic types and resolvers](../examples/simple-usage)

## Advanced

- [Enums and unions](../examples/enums-and-unions)
- [Subscriptions (simple)](../examples/simple-subscriptions)
- [Subscriptions (using Redis)](../examples/redis-subscriptions)
- [Interfaces](../examples/interfaces-inheritance)
- [Extensions (metadata)](../examples/extensions)

## Features usage

- [Dependency injection (IoC container)](../examples/using-container)
  - [Scoped containers](../examples/using-scoped-container)
- [Authorization](../examples/authorization)
- [Validation](../examples/automatic-validation)
  - [Custom validation](../examples/custom-validation)
- [Types inheritance](../examples/interfaces-inheritance)
- [Resolvers inheritance](../examples/resolvers-inheritance)
- [Generic types](../examples/generic-types)
- [Mixin classes](../examples/mixin-classes)
- [Middlewares and Custom Decorators](../examples/middlewares-custom-decorators)
- [Query complexity](../examples/query-complexity)

## 3rd party libs integration

- [TypeORM (manual, synchronous) \*](../examples/typeorm-basic-usage)
- [TypeORM (automatic, lazy relations) \*](../examples/typeorm-lazy-relations)
- [MikroORM](../examples/mikro-orm)
- [Typegoose](../examples/typegoose)
- [Apollo federation](../examples/apollo-federation)
- [Apollo Cache Control](../examples/apollo-cache)
- [Apollo Client local state](../examples/apollo-client)
- [GraphQL Scalars](../examples/graphql-scalars)

_\* Note that we need to edit the `TypeORM` example's `index.ts` with the credentials of our local database_
