# Examples
This folder consist of simple examples showing how to use different `TypeGraphQL` features and how well it integrates with 3rd party libraries.

All examples has a `examples.gql` file with sample queries/mutations/subscriptions that you can execute.

## Basics
- [Simple usage of fields, basic types and resolvers](./simple-usage)

## Advanced
- [Enums and unions](./enums-and-unions)
- [Interfaces and types inheritance](./interfaces-inheritance)
- [Subscriptions (simple)](./simple-subscriptions)
- [Subscriptions (using Redis)](./redis-subscriptions)
- [Resolvers inheritance](./resolvers-inheritance)

## Features usage
- [Dependency injection (IoC containers)](./using-container)
- [Authorization](./authorization)
- [Validation](./automatic-validation)
- [Middlewares](./middlewares)

## 3rd party libs integration
- [TypeORM (manual, synchronous) *](./typeorm-basic-usage)
- [TypeORM (automatic, lazy relations) *](./typeorm-lazy-relations)
- [Apollo Engine (Apollo Cache Control) **](./apollo-engine)

_* Note that you need to edit the TypeORM examples `index.ts` with credentials to your local database_

_** Note that you need to provide `APOLLO_ENGINE_API_KEY` env variable with your own API key_
