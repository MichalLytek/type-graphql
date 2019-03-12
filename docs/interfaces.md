---
title: Interfaces
---

The main idea of TypeGraphQL is to create GraphQL types based on TypeScript classes.

In object-oriented programming its common to create interfaces which describe the contract that classes implementing them have to fulfill - hence TypeGraphQL supports defining GraphQL interfaces.

## How to?

TypeScript has first class support for interfaces. Unfortunately, they only exist at compile-time, so we can't use them to build GraphQL schema at runtime by using decorators.

Luckily, we can use an abstract class for this purpose. It behaves almost like an interface - it can't be "newed" but it can be implemented by the class - and won't prevent developers from implementing a method or initializing a field. So, as long as we treat it like an interface, we can safely use it.

How do we create a GraphQL interface definition? We create an abstract class and decorate it with the `@InterfaceType()` decorator. The rest is exactly the same as with object types: we use the `@Field` decorator to declare the shape of the type:

```typescript
@InterfaceType()
abstract class IPerson {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field(type => Int)
  age: number;
}
```

We can then we use this "interface" in the object type class definition:

```typescript
@ObjectType({ implements: IPerson })
class Person implements IPerson {
  id: string;
  name: string;
  age: number;
}
```

The only difference is that we have to let TypeGraphQL know that this `ObjectType` is implementing the `InterfaceType`. We do this by passing the param `({ implements: IPerson })` to the decorator. If we implement multiple interfaces, we pass an array of interfaces like so: `({ implements: [IPerson, IAnimal, IMachine] })`.

We can also omit the decorators since the GraphQL types will be copied from the interface definition - this way we don't have to maintain two definitions and just rely on TypeScript type checking for correct interface implementation.

Be aware that when our object type is implementing a GraphQL interface type, **we have to return an instance of the type class** in our resolvers. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

## Examples

For more advanced usage examples of interfaces (and types inheritance), e.g. with query returning an interface type, got to [this examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples/interfaces-inheritance).
