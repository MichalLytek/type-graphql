---
title: Interfaces
id: version-1.2.0-rc.1-interfaces
original_id: interfaces
---

The main idea of TypeGraphQL is to create GraphQL types based on TypeScript classes.

In object-oriented programming it is common to create interfaces which describe the contract that classes implementing them must adhere to. Hence, TypeGraphQL supports defining GraphQL interfaces.

Read more about the GraphQL Interface Type in the [official GraphQL docs](https://graphql.org/learn/schema/#interfaces).

## Abstract classes

TypeScript has first class support for interfaces. Unfortunately, they only exist at compile-time, so we can't use them to build GraphQL schema at runtime by using decorators.

Luckily, we can use an abstract class for this purpose. It behaves almost like an interface as it can't be "newed" but it can be implemented by another class. The only difference is that it just won't prevent developers from implementing a method or initializing a field. So, as long as we treat the abstract class like an interface, we can safely use it.

## Defining interface type

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

We can then use this interface type class like an interface in the object type class definition:

```typescript
@ObjectType({ implements: IPerson })
class Person implements IPerson {
  id: string;
  name: string;
  age: number;
}
```

The only difference is that we have to let TypeGraphQL know that this `ObjectType` is implementing the `InterfaceType`. We do this by passing the param `({ implements: IPerson })` to the decorator. If we implement multiple interfaces, we pass an array of interfaces like so: `({ implements: [IPerson, IAnimal, IMachine] })`.

It is also allowed to omit the decorators since the GraphQL types will be copied from the interface definition - this way we won't have to maintain two definitions and solely rely on TypeScript type checking for correct interface implementation.

We can also extend the base interface type abstract class as well because all the fields are inherited and emitted in schema:

```typescript
@ObjectType({ implements: IPerson })
class Person extends IPerson {
  @Field()
  hasKids: boolean;
}
```

## Implementing other interfaces

Since `graphql-js` version `15.0`, it's also possible for interface type to [implement other interface types](https://github.com/graphql/graphql-js/pull/2084).

To accomplish this, we can just use the same syntax that we utilize for object types - the `implements` decorator option:

```typescript
@InterfaceType()
class Node {
  @Field(type => ID)
  id: string;
}

@InterfaceType({ implements: Node })
class Person extends Node {
  @Field()
  name: string;

  @Field(type => Int)
  age: number;
}
```

Also, when we implement the interface that already implements other interface, we need to put them all in `implements` array in `@ObjectType` decorator option, e.g.:

```typescript
@ObjectType({ implements: [Person, Node] })
class Student extends Person {
  @Field()
  universityName: string;
}
```

This example produces following representation in GraphQL SDL:

```graphql
interface Node {
  id: ID!
}

interface Person implements Node {
  id: ID!
  name: String!
  age: Int!
}

type Student implements Node & Person {
  id: ID!
  name: String!
  age: Int!
  universityName: String!
}
```

## Resolvers and arguments

What's more, we can define resolvers for the interface fields, using the same syntax we would use when defining one for our object type:

```typescript
@InterfaceType()
abstract class IPerson {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

They're inherited by all the object types that implements this interface type but does not provide their own resolver implementation for those fields.

Additionally, if we want to declare that the interface accepts some arguments, e.g.:

```graphql
interface IPerson {
  avatar(size: Int!): String!
}
```

We can just use `@Arg` or `@Args` decorators as usual:

```typescript
@InterfaceType()
abstract class IPerson {
  @Field()
  avatar(@Arg("size") size: number): string {
    return `http://i.pravatar.cc/${size}`;
  }
}
```

Unfortunately, TypeScript doesn't allow using decorators on abstract methods.
So if we don't want to provide implementation for that field resolver, only to enforce some signature (args and return type), we have to throw an error inside the body:

```typescript
@InterfaceType()
abstract class IPerson {
  @Field()
  avatar(@Arg("size") size: number): string {
    throw new Error("Method not implemented!");
  }
}
```

And then we need to extend the interface class and override the method by providing its body - it is required for all object types that implements that interface type:

```typescript
@ObjectType({ implements: IPerson })
class Person extends IPerson {
  avatar(size: number): string {
    return `http://i.pravatar.cc/${size}`;
  }
}
```

In order to extend the signature by providing additional arguments (like `format`), we need to redeclare the whole field signature:

```typescript
@ObjectType({ implements: IPerson })
class Person implements IPerson {
  @Field()
  avatar(@Arg("size") size: number, @Arg("format") format: string): string {
    return `http://i.pravatar.cc/${size}.${format}`;
  }
}
```

Resolvers for interface type fields can be also defined on resolvers classes level, by using the `@FieldResolver` decorator:

```typescript
@Resolver(of => IPerson)
class IPersonResolver {
  @FieldResolver()
  avatar(@Root() person: IPerson, @Arg("size") size: number): string {
    return `http://typegraphql.com/${person.id}/${size}`;
  }
}
```

## Registering in schema

By default, if the interface type is explicitly used in schema definition (used as a return type of a query/mutation or as some field type), all object types that implement that interface will be emitted in schema, so we don't need to do anything.

However, in some cases like the `Node` interface that is used in Relay-based systems, this behavior might be not intended when exposing multiple, separates schemas (like a public and the private ones).

In this situation, we can provide an `{ autoRegisterImplementations: false }` option to the `@InterfaceType` decorator to prevent emitting all this object types in the schema:

```ts
@InterfaceType({ autoRegisterImplementations: false })
abstract class Node {
  @Field(type => ID)
  id: string;
}
```

Then we need to add all the object types (that implement this interface type and which we want to expose in selected schema) to the `orphanedTypes` array option in `buildSchema`:

```ts
const schema = await buildSchema({
  resolvers,
  // here we provide such object types
  orphanedTypes: [Person, Animal, Recipe],
});
```

Be aware that if the object type class is explicitly used as the GraphQL type (like `Recipe` type as the return type of `addRecipe` mutation), it will be emitted regardless the `orphanedTypes` setting.

## Resolving Type

Be aware that when our object type is implementing a GraphQL interface type, **we have to return an instance of the type class** in our resolvers. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

We can also provide our own `resolveType` function implementation to the `@InterfaceType` options. This way we can return plain objects in resolvers and then determine the returned object type by checking the shape of the data object, the same ways [like in unions](./unions.md), e.g.:

```typescript
@InterfaceType({
  resolveType: value => {
    if ("grades" in value) {
      return "Student"; // schema name of the type as a string
    }
    return Person; // or the object type class
  },
})
abstract class IPerson {
  // ...
}
```

However in case of interfaces, it might be a little bit more tricky than with unions, as we might not remember all the object types that implements this particular interface.

## Examples

For more advanced usage examples of interfaces (and type inheritance), e.g. with query returning an interface type, go to [this examples folder](https://github.com/MichalLytek/type-graphql/tree/master/examples/interfaces-inheritance).
