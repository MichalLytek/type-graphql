---
title: Generic Types
id: version-1.2.0-rc.1-generic-types
original_id: generic-types
---

[Type Inheritance](inheritance.md) is a great way to reduce code duplication by extracting common fields to the base class. But in some cases, the strict set of fields is not enough because we might need to declare the types of some fields in a more flexible way, like a type parameter (e.g. `items: T[]` in case of a pagination).

Hence TypeGraphQL also has support for describing generic GraphQL types.

## How to?

Unfortunately, the limited reflection capabilities of TypeScript don't allow for combining decorators with standard generic classes. To achieve behavior like that of generic types, we use the same class-creator pattern like the one described in the [Resolvers Inheritance](inheritance.md) docs.

### Basic usage

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

### Complex generic type values

When we need to provide something different than a class (object type) for the field type, we need to enhance the parameter type signature and provide the needed types.

Basically, the parameter that the `PaginatedResponse` function accepts is the value we can provide to `@Field` decorator.
So if we want to return an array of strings as the `items` field, we need to add proper types to the function signature, like `GraphQLScalarType` or `String`:

```typescript
export default function PaginatedResponse<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue> | GraphQLScalarType | String | Number | Boolean,
) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(type => [itemsFieldValue])
    items: TItemsFieldValue[];

    // ...other fields
  }
  return PaginatedResponseClass;
}
```

And then provide a proper runtime value (like `String`) while creating a proper subtype of generic `PaginatedResponse` object type:

```typescript
@ObjectType()
class PaginatedStringsResponse extends PaginatedResponse<string>(String) {
  // ...
}
```

### Types factory

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

A more advanced usage example of the generic types feature can be found in [this examples folder](https://github.com/MichalLytek/type-graphql/tree/master/examples/generic-types).
