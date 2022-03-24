# Examples

This folder consist of simple examples showing how to use different `TypeGraphQL` features and how well it integrates with 3rd party libraries.

All examples has a `examples.gql` file with sample queries/mutations/subscriptions that you can execute.

> **Note**: Be aware that the examples on master branch are designed to work with latest codebase that might not be released yet.
> So if you are looking for examples that are compatible with the version you use, just browse the files by the git tag, e.g. [`tree/v0.16.0` for `0.16.0` release](https://github.com/MichalLytek/type-graphql/tree/v0.16.0/examples).

## Basics

- [Simple usage of fields, basic types and resolvers](./simple-usage)

## Advanced

- [Enums and unions](./enums-and-unions)
- [Subscriptions (simple)](./simple-subscriptions)
- [Subscriptions (using Redis)](./redis-subscriptions)
- [Interfaces](./interfaces-inheritance)
- [Extensions (metadata)](./extensions)

## Features usage

- [Dependency injection (IoC container)](./using-container)
  - [Scoped containers](./using-scoped-container)
- [Authorization](./authorization)
- [Validation](./automatic-validation)
  - [Custom validation](./custom-validation)
- [Types inheritance](./interfaces-inheritance)
- [Resolvers inheritance](./resolvers-inheritance)
- [Generic types](./generic-types)
- [Mixin classes](./mixin-classes)
- [Middlewares and custom decorators](./middlewares-custom-decorators)
- [Query complexity](./query-complexity)

## 3rd party libs integration

- [TypeORM (manual, synchronous) \*](./typeorm-basic-usage)
- [TypeORM (automatic, lazy relations) \*](./typeorm-lazy-relations)
- [MikroORM](./mikro-orm)
- [Typegoose](./typegoose)
- [Apollo federation](./apollo-federation)
- [Apollo Cache Control](./apollo-cache)
- [Apollo Client local state](./apollo-client)
- [GraphQL Modules](./graphql-modules)

_\* Note that you need to edit the TypeORM examples `index.ts` with credentials to your local database_
