---
title: Interfaces
---

The main idea of TypeGraphQL is to create GraphQL types based on TypeScript classes.

In object-oriented programming it is common to create interfaces which describes the contract that classes implementing them has to fulfill - hence TypeGraphQL supports defining GraphQL interfaces.

## How to?

TypeScript has first class support for interfaces. Unfortunately, they only exist at compile-time, so we can't use them to build GraphQL schema at runtime by using decorators.

Luckily, we can use an abstract class for this purpose. It behaves almost like an interface (can't be "newed", can be implemented by class), it just won't stop developers from implementing a method or initializing a field. But as long as we treat it like an interface, we can safely use it.

So, how do you create GraphQL interface definition? We create an abstract class and decorate it with `@InterfaceType()`. The rest is exactly the same as with object types: we use `@Field` to declare the shape of the type:

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

Then we can use this "interface" in object type class definition:

```typescript
@ObjectType({ implements: IPerson })
class Person implements IPerson {
  id: string;
  name: string;
  age: number;
}
```

The only difference is that we have to let TypeGraphQL know that this `ObjectType` is implementing the `InterfaceType`. We do it by passing the param `({ implements: IPerson })` to the decorator. If we implemented more interfaces, we would pass the array of interfaces, like `({ implements: [IPerson, IAnimal, IMachine] })`.

We can also omit the decorators as the GraphQL types will be copied from the interface definition - this way we don't have to maintain two definitions and just rely on TypeScript type checking of correct interface implementation.

Be aware that when your object type is implementing GraphQL interface type, **you have to return an instance of the type class** in your resolvers. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

## Examples

More advanced usage example of interfaces (and types inheritance), e.g. with query returning interface type, you can see in [this examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples/interfaces-inheritance).
