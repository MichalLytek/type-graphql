---
title: Generic Types
id: version-0.17.5-generic-types
original_id: generic-types
---

[Type Inheritance](inheritance.md) is a great way to reduce code duplication by extracting common fields to the base class. But in some cases, the strict set of fields is not enough because we might need to declare the types of some fields in a more flexible way, like a type parameter (e.g. `items: T[]` in case of a pagination).

Hence TypeGraphQL also has support for describing generic GraphQL types.

## How to?

Unfortunately, the limited reflection capabilities of TypeScript don't allow for combining decorators with standard generic classes. To achieve behavior like that of generic types, we use the same class-creator pattern like the one described in the [Resolvers Inheritance](inheritance.md) docs.

Start by defining a `PaginatedResponse` function that creates and returns a `PaginatedResponseClass`:

```typescript
export default function PaginatedResponse() {
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

To achieve generic-like behavior, the function has to be generic and take some runtime argument related to the type parameter:

```typescript
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

Then, add proper decorators to the class which might be `@ObjectType`, `@InterfaceType` or `@InputType`.
It also should have set `isAbstract: true` to prevent getting registered in the schema:

```typescript
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

After that, add fields like in a normal class but using the generic type and parameters:

```typescript
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    // here we use the runtime argument
    @Field(type => [TItemClass])
    // and here the generic type
    items: TItem[];

    @Field(type => Int)
    total: number;

    @Field()
    hasMore: boolean;
  }
  return PaginatedResponseClass;
}
```

Finally, use the generic function factory to create a dedicated type class:

```typescript
@ObjectType()
class PaginatedUserResponse extends PaginatedResponse(User) {
  // we can freely add more fields or overwrite the existing one's types
  @Field(type => [String])
  otherInfo: string[];
}
```

And then use it in our resolvers:

```typescript
@Resolver()
class UserResolver {
  @Query()
  users(): PaginatedUserResponse {
    // here is your custom business logic,
    // depending on underlying data source and libraries
    return {
      items,
      total,
      hasMore,
      otherInfo,
    };
  }
}
```

We can also create a generic class without using the `isAbstract` option or the `abstract` keyword.
But types created with this kind of factory will be registered in the schema, so this way is not recommended to extend the types for adding fields.

To avoid generating schema errors of duplicated `PaginatedResponseClass` type names, we must provide our own unique, generated type name:

```typescript
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // instead of `isAbstract`, we have to provide a unique type name used in schema
  @ObjectType(`Paginated${TItemClass.name}Response`)
  class PaginatedResponseClass {
    // the same fields as in the earlier code snippet
  }
  return PaginatedResponseClass;
}
```

Then, we can store the generated class in a variable and in order to use it both as a runtime object and as a type, we must also create a type for this new class:

```typescript
const PaginatedUserResponse = PaginatedResponse(User);
type PaginatedUserResponse = InstanceType<typeof PaginatedUserResponse>;

@Resolver()
class UserResolver {
  // remember to provide a runtime type argument to the decorator
  @Query(returns => PaginatedUserResponse)
  users(): PaginatedUserResponse {
    // the same implementation as in the earlier code snippet
  }
}
```

## Examples

A more advanced usage example of the generic types feature can be found in [this examples folder](https://github.com/19majkel94/type-graphql/tree/v0.17.5/examples/generic-types).
