---
title: Interfaces and inheritance
id: version-0.16.0-interfaces-and-inheritance
original_id: interfaces-and-inheritance
---

The main idea of TypeGraphQL is to create GraphQL types based on TypeScript classes.

In object-oriented programming it is common to create interfaces which describes the contract that classes implementing them has to fulfill. We also compose classes using inheritance. Hence TypeGraphQL supports both GraphQL interfaces as well as composing type definitions by extending the classes.

## Interfaces
TypeScript has first class support for interfaces. Unfortunately, they only exist at compile-time, so we can't use them to build GraphQL schema at runtime by using decorators.

Luckily, we can use an abstract class for this purpose.  It behaves almost like an interface (can't be "newed", can be implemented by class), it just won't stop developers from implementing a method or initializing a field. But as long as we treat it like an interface, we can safely use it.

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

Be aware that when your object type is implementing GraphQL interface type, __you have to return an instance of the type class__ in your resolvers. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

## Types inheritance
One of the most known principles of software development is DRY - don't repeat yourself - which tells about avoiding redundancy in our code.

While creating GraphQL API, it's a common pattern to have pagination args in resolvers, like `skip` and `take`. So instead of repeating yourself, you can declare it once: 
```typescript
@ArgsType()
class PaginationArgs {
  @Field(type => Int)
  skip: number = 0;

  @Field(type => Int)
  take: number = 25;
}
```

and then reuse it everywhere:
```typescript
@ArgsType()
class GetTodosArgs extends PaginationArgs {
  @Field()
  onlyCompleted: boolean = false;
}
```

This technique also works with input type classes, as well as with object type classes:
```typescript
@ObjectType()
class Person {
  @Field()
  age: number;
}

@ObjectType()
class Student extends Person {
  @Field()
  universityName: string;
}
```

Note that both the subclass and the parent class must be decorated with the same type of decorator, like `@ObjectType()` in the example `Person -> Student` above. Mixing decorator types across parent and child classes is prohibited and might result in schema building error - you can't e.g decorate the subclass with `@ObjectType()` and the parent with `@InputType()`.

## Resolvers inheritance
The special kind of inheritance in TypeGraphQL is a resolver classes inheritance. This pattern allows you to e.g. create a base CRUD resolver class for your resource/entity, so you don't have to repeat the common boilerplate code all the time.

As we need to generate unique query/mutation names, we have to create a factory function for our base class:
```typescript
function createBaseResolver() {
  abstract class BaseResolver {}

  return BaseResolver;
}
```
Be aware that with some `tsconfig.json` settings you might receive `[ts] Return type of exported function has or is using private name 'BaseResolver'` error - in that case you might need to use `any` as a return type or create a separate class/interface describing the class methods and properties.

This factory should take a parameter that we can use to generate queries/mutations names, as well as the type that we would return from the resolvers:
```typescript
function createBaseResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  abstract class BaseResolver {}

  return BaseResolver;
}
```

It's very important to mark the `BaseResolver` class using `@Resolver` decorator with `{ isAbstract: true }` option that will prevent throwing error due to registering multiple queries/mutations with the same name.
```typescript
function createBaseResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {}

  return BaseResolver;
}
```

Then we can implement the resolvers methods in the same way as always. The only difference is that we can use `name` decorator option for `@Query`, `@Mutation` and `@Subscription` decorators to overwrite the name that will be emitted in schema:
```typescript
function createBaseResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    protected items: T[] = [];

    @Query(type => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll(
      @Arg("first", type => Int) first: number,
    ): Promise<T[]> {
      return this.items.slice(0, first);
    }
  }

  return BaseResolver;
}
```

After that we can create a specific resolver class that will extend the base resolver class:
```typescript
const PersonBaseResolver = createBaseResolver("person", Person);

@Resolver(of => Person)
export class PersonResolver extends PersonBaseResolver {
  // ...
}
```

We can also add specific queries and mutation in our resolver class, just like always:
```typescript
const PersonBaseResolver = createBaseResolver("person", Person);

@Resolver(of => Person)
export class PersonResolver extends PersonBaseResolver {
  @Mutation()
  addPerson(@Arg("input") personInput: PersonInput): Person {
    this.items.push(personInput);
    return personInput;
  }
}
```
And that's it! We just need to normally register `PersonResolver` in `buildSchema` and the extended resolver will be working correctly.

Be aware that if you want to overwrite the query/mutation/subscription from parent resolver class, you need to generate the same schema name (using `name` decorator option or the class method name). It will overwrite the implementation along with GraphQL args and return types. If you only provide different implementation of the inherited method like `getOne`, it won't work.

## Examples
More advanced usage example of interfaces and types inheritance (e.g. with query returning interface type) you can see in [this examples folder](https://github.com/MichalLytek/type-graphql/tree/master/examples/interfaces-inheritance).

For more advanced resolvers inheritance example, please go to [the example folder](https://github.com/MichalLytek/type-graphql/tree/master/examples/resolvers-inheritance).
