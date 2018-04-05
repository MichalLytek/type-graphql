# Examples
This folder consist of simple examples showing how to use different `TypeGraphQL` features and how well it integrates with 3rd party libraries.

All examples has a `examples.gql` file with sample queries/mutations/subscriptions that you can execute.

## Basics
- [Simple usage of fields, basic types and resolvers](./simple-usage)

## Advanced
- [Enums and unions](./enums-and-unions)
- [Interfaces and inheritance](./interfaces-inheritance)
- [Subscriptions (simple)](./simple-subscriptions)
- [Subscriptions (using Redis)](./redis-subscriptions)

## Features usage
- [Dependency injection (IoC containers)](./using-container)
- [Authorization](./authorization)
- [Validation](./automatic-validation)

## 3rd party libs integration
- [TypeORM (manual, synchronous)](./typeorm-basic-usage)
- [TypeORM (automatic, lazy relations)](./typeorm-lazy-relations)

_* Note that you need to edit the TypeORM examples `index.ts` with credentials to your local database_
