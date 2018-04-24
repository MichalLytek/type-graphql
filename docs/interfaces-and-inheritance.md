---
title: Interfaces and inheritance
---

The main idea of TypeGraphQL is to create GraphQL types based on TypeScript classes.

In object-oriented programming it is common to create interfaces which describes the contract that classes implementing them has to fulfill. We also compose the classes using inheritance mechanism. Hence TypeGraphQL support both GraphQL interfaces as well as composing types definition by extending the classes.

## Interfaces
TypeScript has first class support for interfaces. Unfortunately, they exist only on compile-time, so we can't use them to build GraphQL schema on runtime by using decorators.

Luckily, we can use abstract class for this purpose - it behave almost like an interface (can't be "newed", can be implemented by class), it just won't stop developers from implementing a method or initializing a field. But until we do the same things like with an interface, we can safely use it.

So, how to create GraphQL interface definition? We create an abstract class and decorate it with `@InterfaceType()`. The rest is exactly the same as with object types - we use `@Field` to declare the shape of the type:

```ts
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

```ts
@ObjectType({ implements: IPerson })
class Person implements IPerson {
  id: string;
  name: string;
  age: number;
}
```

The only difference is that we have to let TypeGraphQL now that this `ObjectType` is implementing the `InterfaceType` by passing the param `({ implements: IPerson })` to the decorator. If we implemented more interfaces, we would pass the array of interfaces, like `({ implements: [IPerson, IAnimal, IMachine] })`.

We can also omit the decorators as the GraphQL types will be copied from the interface definition - this way we don't have to maintain two definitions and just rely on TypeScript type checking of correct interface implementation.

Be aware that when your object type is implementing GraphQL interface type, __you have to return an instance of the type class__ in your resolvers. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

## Inheritance
One of the most known principles of software development is DRY - don't repeat yourself - which tells about avoiding redundancy in our code.

While creating GraphQL API, it's a common pattern to have pagination args in resolvers, like `skip` and `take`. So instead of repeating yourself, you can declare it once: 
```ts
@ArgsType()
class PaginationArgs {
  @Field(type => Int, { nullable: true })
  skip: number = 0;

  @Field(type => Int, { nullable: true })
  take: number = 25;
}
```

and then reuse it everywhere:
```ts
@ArgsType()
class GetTodosArgs extends PaginationArgs {
  @Field({ nullable: false })
  onlyCompleted: boolean = false;
}
```

This technique also works with input type classes, as well as with object type classes:
```ts
// `Person` is the object type class we've created earlier in this docs
@ObjectType()
class Student extends Person {
  @Field()
  universityName: string;
}
```

## Example
You can see more advanced usage example (e.g. with query returning interface type) in the [examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples/interfaces-inheritance).
