---
title: Extensions
---

It is sometimes desired to be able to annotate schema entities (fields, object types, or even queries and mutations...) with custom metadata that can be used at runtime by middlewares or resolvers.

For such use cases, **TypeGraphQL** provides the `@Extensions` decorator, which will add the data you defined to the `extensions` field of your executable schema for the decorated entity.

_Note:_ This is a low-level decorator and you will generally have to provide your own logic to make use of the `extensions` data.

## How to use

### Using the @Extensions decorator

Adding extensions to your schema entity is as simple as using the `@Extensions` decorator and passing it an object of the custom data you want:

```typescript
@Extensions({ complexity: 2 })
```

You can pass several fields to the decorator:

```typescript
@Extensions({ logMessage: "Restricted access", logLevel: 1 })
```

And you can also decorate an entity several times, this will attach the exact same extensions data to your schema entity than the example above:

```typescript
@Extensions({ logMessage: "Restricted access" })
@Extensions({ logLevel: 1 })
```

If you decorate the same entity several times with the same extensions key, the one defined at the bottom will take precedence:

```typescript
@Extensions({ logMessage: "Restricted access" })
@Extensions({ logMessage: "Another message" })
```

The above will result in your entity having `logmessage: "Another message"` in its extensions.

The following entities can be decorated with extensions:

- @Field
- @ObjectType
- @InputType
- @Query
- @Mutation
- @FieldResolver

So the `@Extensions` decorator can be placed over the class property/method or over the type class itself, and multiple times if necessary, depending on what you want to do with the extensions data:

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

### Using the extensions data

Once you have decorated the necessary entities with extensions, your executable schema will contain the extensions data, and you can make use of it in any way you choose.

The most common use will be to read it at runtime in resolvers or middlewares and perform some custom logic there.

Here is a simple example of a global middleware logging a message whenever a field is decorated appropriately:

```typescript
export class LoggerMiddleware implements MiddlewareInterface<Context> {
  constructor(private readonly logger: Logger) {}

  async use({ info }, next: NextFn) {
    const { logMessage } = info.parentType.getFields()[info.fieldName].extensions || {};

    if (logMessage) {
      this.logger.log(logMessage);
    }

    return next();
  }
}

// build the schema and register the global middleware
const schema = buildSchemaSync({
  resolvers: [SampleResolver],
  globalMiddlewares: [LoggerMiddleware],
});

// declare your type and decorate the appropriate field with "logMessage" extensions
@ObjectType()
class Bar {
  @Extensions({ logMessage: "Restricted field was accessed" })
  @Field()
  field: string;
}
```

## Examples

You can see more detailed examples of usage [here](https://github.com/MichalLytek/type-graphql/tree/master/examples/extensions).
