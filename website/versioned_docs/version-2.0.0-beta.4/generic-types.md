---
title: Generic Types
id: version-2.0.0-beta.4-generic-types
original_id: generic-types
---

[Type Inheritance](./inheritance.md) is a great way to reduce code duplication by extracting common fields to the base class. But in some cases, the strict set of fields is not enough because we might need to declare the types of some fields in a more flexible way, like a type parameter (e.g. `items: T[]` in case of a pagination).

Hence TypeGraphQL also has support for describing generic GraphQL types.

## How to?

Unfortunately, the limited reflection capabilities of TypeScript don't allow for combining decorators with standard generic classes. To achieve behavior like that of generic types, we use the same class-creator pattern like the one described in the [Resolvers Inheritance](./inheritance.md) docs.

### Basic usage

Start by defining a `PaginatedResponse` function that creates and returns an abstract `PaginatedResponseClass`:

```ts
export default function PaginatedResponse() {
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

To achieve generic-like behavior, the function has to be generic and take some runtime argument related to the type parameter:

```ts
export default function PaginatedResponse<TItem extends object>(TItemClass: ClassType<TItem>) {
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

Then, add proper decorators to the class which might be `@ObjectType`, `@InterfaceType` or `@InputType`:

```ts
export default function PaginatedResponse<TItem extends object>(TItemClass: ClassType<TItem>) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

After that, add fields like in a normal class but using the generic type and parameters:

```ts
export default function PaginatedResponse<TItem extends object>(TItemClass: ClassType<TItem>) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    // Runtime argument
    @Field(type => [TItemClass])
    // Generic type
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

```ts
@ObjectType()
class PaginatedUserResponse extends PaginatedResponse(User) {
  // Add more fields or overwrite the existing one's types
  @Field(type => [String])
  otherInfo: string[];
}
```

And then use it in our resolvers:

```ts
@Resolver()
class UserResolver {
  @Query()
  users(): PaginatedUserResponse {
    // Custom business logic,
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

### Complex generic type values

When we need to provide something different than a class (object type) for the field type, we need to enhance the parameter type signature and provide the needed types.

Basically, the parameter that the `PaginatedResponse` function accepts is the value we can provide to `@Field` decorator.
So if we want to return an array of strings as the `items` field, we need to add proper types to the function signature, like `GraphQLScalarType` or `String`:

```ts
export default function PaginatedResponse<TItemsFieldValue extends object>(
  itemsFieldValue: ClassType<TItemsFieldValue> | GraphQLScalarType | String | Number | Boolean,
) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    @Field(type => [itemsFieldValue])
    items: TItemsFieldValue[];

    // ... Other fields
  }
  return PaginatedResponseClass;
}
```

And then provide a proper runtime value (like `String`) while creating a proper subtype of generic `PaginatedResponse` object type:

```ts
@ObjectType()
class PaginatedStringsResponse extends PaginatedResponse<string>(String) {
  // ...
}
```

### Types factory

We can also create a generic class without using the `abstract` keyword.
But with this approach, types created with this kind of factory will be registered in the schema, so this way is not recommended to extend the types for adding fields.

To avoid generating schema errors of duplicated `PaginatedResponseClass` type names, we must provide our own unique, generated type name:

```ts
export default function PaginatedResponse<TItem extends object>(TItemClass: ClassType<TItem>) {
  // Provide a unique type name used in schema
  @ObjectType(`Paginated${TItemClass.name}Response`)
  class PaginatedResponseClass {
    // ...
  }
  return PaginatedResponseClass;
}
```

Then, we can store the generated class in a variable and in order to use it both as a runtime object and as a type, we must also create a type for this new class:

```ts
const PaginatedUserResponse = PaginatedResponse(User);
type PaginatedUserResponse = InstanceType<typeof PaginatedUserResponse>;

@Resolver()
class UserResolver {
  // Provide a runtime type argument to the decorator
  @Query(returns => PaginatedUserResponse)
  users(): PaginatedUserResponse {
    // Same implementation as in the earlier code snippet
  }
}
```

## Examples

A more advanced usage example of the generic types feature can be found in [this examples folder](https://github.com/MichalLytek/type-graphql/tree/v2.0.0-beta.4/examples/generic-types).
