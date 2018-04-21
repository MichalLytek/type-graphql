# Documentation
This folder consist of series of docs showing how to use `TypeGraphQL` to create GraphQL's schema.
You can learn both the basics as well as advanced techniques and additional features.

[**FAQ** - Frequently Asked Questions](./faq.md)

## First steps
- [introduction](./introduction.md) (what is TypeGraphQL and why it was made)
- [getting started](./getting-started.md) (creating simple example app with TypeGraphQL)

## Basics
- [types and fields](./types-and-fields.md) (how to create object type, define its fields and types)
- [queries, mutations and field resolvers](./resolvers.md)
- [app bootstrapping](./bootstrap.md) (how to build the TypeGraphQL's schema and run HTTP server)

## Advanced
- [scalars](./scalars.md) (built-in and custom scalars)
- [enums](./enums.md) (basic enum usage)
- [unions](./unions.md) (defining type-safe union types)
- [interfaces and inheritance](./interfaces-and-inheritance.md) (creating GraphQL's interfaces and reuse input/args definitions)
- [subscriptions](./subscriptions.md) (creating GraphQL subscriptions with pubsub and filters)

## Features
- [dependency injection](./dependency-injection.md) (usage of IoC containers)
- [authorization](./authorization.md) (restricting access to fields or queries/mutation, based on roles)
- [validation](./validation.md) (nice integration with [class-validator](https://github.com/typestack/class-validator))
