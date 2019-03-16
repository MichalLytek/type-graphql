---
title: Generic types
---

[Types inheritance](inheritance.md) is a great way to reduce the code duplication by extracting common fields to the base class. But in some cases, the strict set of fields is not enough because we might need to declare the types of some fields in a more flexible way, like a type parameter (e.g. `items: T[]` in case of a pagination).

Hence TypeGraphQL has also support for describing generic GraphQL types.

## How to?

Unfortunately, the limited reflection capabilities of TypeScript doesn't allow for combining decorator with the standard generic classes. To achieve a behavior like the generic types, we will use the same class-creator pattern like the one described in [resolvers inheritance](inheritance.md) docs.

So we will start by defining a `PaginatedResponse` function that creates and returns a `PaginatedResponseClass`:

```typescript
export default function PaginatedResponse() {
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

To achieve a generic-like behavior, the function has to be generic and take some runtime argument related to the type parameter:

```typescript
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

Then, we need to add proper decorators to the class - it might be `@ObjectType`, `@InterfaceType` or `@InputType`.
It also should have set `isAbstract: true` to prevent registering in schema:

```typescript
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

After that, we can add fields like in a normal class but using the generic type and parameters:

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

Finally, we can use the generic function factory to create a dedicated type class:

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

You can also create a generic class without using `isAbstract` option or `abstract` keyword.
But types created with this kind of factory will be registered in schema, so it's not recommended to use this way to extend the types for adding some more fields.

To avoid generating schema errors about duplicated `PaginatedResponseClass` type names, you need to provide your own, unique, generated type name:

```typescript
export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // instead of `isAbstract`, you have to provide a unique type name used in schema
  @ObjectType({ name: `Paginated${TItemClass.name}Response` })
  class PaginatedResponseClass {
    // the same fields as in the earlier code snippet
  }
  return PaginatedResponseClass;
}
```

Then, you can store the generated class in a variable. To be able to use it both as a runtime object and a type, you also have to create a type for this new class:

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

More advanced usage example of a generic types feature you can see in [this examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples/generic-types).
