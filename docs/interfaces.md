---
title: Interfaces
---

The main idea of TypeGraphQL is to create GraphQL types based on TypeScript classes.

In object-oriented programming it is common to create interfaces which describe the contract that classes implementing them must adhere to. Hence, TypeGraphQL supports defining GraphQL interfaces.

Read more about the GraphQL Interface Type in the [official GraphQL docs](https://graphql.org/learn/schema/#interfaces).

## Usage

TypeScript has first class support for interfaces. Unfortunately, they only exist at compile-time, so we can't use them to build GraphQL schema at runtime by using decorators.

Luckily, we can use an abstract class for this purpose. It behaves almost like an interface - it can't be "newed" but it can be implemented by the class - and it just won't prevent developers from implementing a method or initializing a field. So, as long as we treat it like an interface, we can safely use it.

### Defining interface type

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

We can then use this "interface" in the object type class definition:

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

You can also extend the base interface type abstract class as all the fields are inherited and emitted in schema:

```typescript
@ObjectType({ implements: IPerson })
class Person extends IPerson {
  @Field()
  hasKids: boolean;
}
```

### Resolvers and arguments

We can also define resolvers for the interface fields, using the same syntax we would use when defining one for our object type:

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

They are inherited by all the object types that implements this interface type but does not provide their own resolver implementation for those fields.

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
So if we don't want to provide implementation for that field resolver, only to enforce some signature (args and return type), we just need to throw an error inside the body:

```typescript
@InterfaceType()
abstract class IPerson {
  @Field()
  avatar(@Arg("size") size: number): string {
    throw new Error("Method not implemented!");
  }
}
```

And then we have to extends the interface class and and override the method by providing body, for all object types that implements that interface type:

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
