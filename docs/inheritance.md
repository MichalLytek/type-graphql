---
title: Inheritance
---

The main idea of TypeGraphQL is to create GraphQL types based on TypeScript classes.

In object-oriented programming it is common to compose classes using inheritance. Hence TypeGraphQL supports composing type definitions by extending classes.

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

Note that both the subclass and the parent class must be decorated with the same type of decorator, like `@ObjectType()` in the example `Person -> Student` above. Mixing decorator types across parent and child classes is prohibited and might result in a schema building error - you can't e.g decorate the subclass with `@ObjectType()` and the parent with `@InputType()`.

## Resolver inheritance

A special kind of inheritance in TypeGraphQL is resolver class inheritance. This pattern allows you to e.g. create a base CRUD resolver class for your resource/entity, so you don't have to repeat the common boilerplate code.

Since we need to generate unique query/mutation names, we have to create a factory function for our base class:

```typescript
function createBaseResolver() {
  abstract class BaseResolver {}

  return BaseResolver;
}
```

Be aware that with some `tsconfig.json` settings (like `declarations: true`) you might receive a `[ts] Return type of exported function has or is using private name 'BaseResolver'` error - in this case you might need to use `any` as the return type or create a separate class/interface describing the class methods and properties.

This factory should take a parameter that we can use to generate the query/mutation names, as well as the type that we would return from the resolvers:

```typescript
function createBaseResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  abstract class BaseResolver {}

  return BaseResolver;
}
```

It's very important to mark the `BaseResolver` class using the `@Resolver` decorator with the `{ isAbstract: true }` option that will prevent throwing an error due to registering multiple queries/mutations with the same name.

```typescript
function createBaseResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {}

  return BaseResolver;
}
```

Then we can implement the resolver methods as usual. The only difference is that we can use the `name` decorator option for `@Query`, `@Mutation` and `@Subscription` decorators to overwrite the name that will be emitted in schema:

```typescript
function createBaseResolver<T extends ClassType>(suffix: string, objectTypeCls: T) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    protected items: T[] = [];

    @Query(type => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll(@Arg("first", type => Int) first: number): Promise<T[]> {
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

We can also add specific queries and mutations in our resolver class, as always:

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

And that's it! We just need to normally register `PersonResolver` in `buildSchema` and the extended resolver will work correctly.

We must be aware that if we want to overwrite the query/mutation/subscription from the parent resolver class, we need to generate the same schema name (using the `name` decorator option or the class method name). It will overwrite the implementation along with the GraphQL args and return types. If we only provide a different implementation of the inherited method like `getOne`, it won't work.

## Examples

More advanced usage example of types inheritance (and interfaces) you can see in [the example folder](https://github.com/19majkel94/type-graphql/tree/master/examples/interfaces-inheritance).

For more advanced resolvers inheritance example, please go to [this example folder](https://github.com/19majkel94/type-graphql/tree/master/examples/resolvers-inheritance).
