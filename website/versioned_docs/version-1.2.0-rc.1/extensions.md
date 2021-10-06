---
title: Extensions
id: version-1.2.0-rc.1-extensions
original_id: extensions
---

The `graphql-js` library allows for putting arbitrary data into GraphQL types config inside the `extensions` property.
Annotating schema types or fields with a custom metadata, that can be then used at runtime by middlewares or resolvers, is a really powerful and useful feature.

For such use cases, **TypeGraphQL** provides the `@Extensions` decorator, which adds the data we defined to the `extensions` property of the executable schema for the decorated classes, methods or properties.

> Be aware that this is a low-level decorator and you generally have to provide your own logic to make use of the `extensions` metadata.

## Using the `@Extensions` decorator

Adding extensions to the schema type is as simple as using the `@Extensions` decorator and passing it an object of the custom data we want:

```typescript
@Extensions({ complexity: 2 })
```

We can pass several fields to the decorator:

```typescript
@Extensions({ logMessage: "Restricted access", logLevel: 1 })
```

And we can also decorate a type several times. The snippet below shows that this attaches the exact same extensions data to the schema type as the snippet above:

```typescript
@Extensions({ logMessage: "Restricted access" })
@Extensions({ logLevel: 1 })
```

If we decorate the same type several times with the same extensions key, the one defined at the bottom takes precedence:

```typescript
@Extensions({ logMessage: "Restricted access" })
@Extensions({ logMessage: "Another message" })
```

The above usage results in your GraphQL type having a `logMessage: "Another message"` property in its extensions.

TypeGraphQL classes with the following decorators can be annotated with `@Extensions` decorator:

- `@ObjectType`
- `@InputType`
- `@Field`
- `@Query`
- `@Mutation`
- `@FieldResolver`

So the `@Extensions` decorator can be placed over the class property/method or over the type class itself, and multiple times if necessary, depending on what we want to do with the extensions data:

```typescript
@Extensions({ roles: ["USER"] })
@ObjectType()
class Foo {
  @Field()
  field: string;
}

@ObjectType()
class Bar {
  @Extensions({ roles: ["USER"] })
  @Field()
  field: string;
}

@ObjectType()
class Bar {
  @Extensions({ roles: ["USER"] })
  @Extensions({ visible: false, logMessage: "User accessed restricted field" })
  @Field()
  field: string;
}

@Resolver(of => Foo)
class FooBarResolver {
  @Extensions({ roles: ["USER"] })
  @Query()
  foobar(@Arg("baz") baz: string): string {
    return "foobar";
  }

  @Extensions({ roles: ["ADMIN"] })
  @FieldResolver()
  bar(): string {
    return "foobar";
  }
}
```

## Using the extensions data in runtime

Once we have decorated the necessary types with extensions, the executable schema will contain the extensions data, and we can make use of it in any way we choose. The most common use will be to read it at runtime in resolvers or middlewares and perform some custom logic there.

Here is a simple example of a global middleware that will be logging a message on field resolver execution whenever the field is decorated appropriately with `@Extensions`:

```typescript
export class LoggerMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  use({ info }: ResolverData, next: NextFn) {
    // extract `extensions` object from GraphQLResolveInfo object to get the `logMessage` value
    const { logMessage } = info.parentType.getFields()[info.fieldName].extensions || {};

    if (logMessage) {
      this.logger.log(logMessage);
    }

    return next();
  }
}
```

## Examples

You can see more detailed examples of usage [here](https://github.com/MichalLytek/type-graphql/tree/master/examples/extensions).
