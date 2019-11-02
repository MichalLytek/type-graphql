---
title: Directives
---

[GraphQL directives](https://www.apollographql.com/docs/graphql-tools/schema-directives/) though the syntax might remind the TS decorators:

> A directive is an identifier preceded by a @ character, optionally followed by a list of named arguments, which can appear after almost any form of syntax in the GraphQL query or schema languages.

But in fact, they are a purely SDL (Schema Definition Language) feature that allows you to put some metadata for selected type or its field:

```graphql
type Foo @auth(requires: USER) {
  field: String!
}

type Bar {
  field: String! @auth(requires: USER)
}
```

That metadata can be read in runtime to modify the structure and behavior of a GraphQL schema to support reusable code and tasks like authentication, permission, formatting, and plenty more. They are also really useful for some external services like [Apollo Cache Control](https://www.apollographql.com/docs/apollo-server/performance/caching/#adding-cache-hints-statically-in-your-schema) or [Apollo Federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/#federated-schema-example).

**TypeGraphQL** of course provides some basic support for using the schema directives via the `@Directive` decorator.

## Usage

### Declaring in schema

Basically, there are two supported ways of declaring the usage of directives:

- string based - just like in SDL, with the `@` syntax:

```typescript
@Directive('@deprecated(reason: "Use newField")')
```

- object based - using a JS object to pass the named arguments

```typescript
@Directive("deprecated", { reason: "Use newField" }) // syntax without `@` !!!
```

Currently, you can use the directives only on object types, input types and their fields, as well as queries and mutations.

So the `@Directive` decorator can be placed over the class property/method or over the class itself, depending on the needs and the placements supported by the implementation:

```typescript
@Directive("@auth(requires: USER)")
@ObjectType()
class Foo {
  @Field()
  field: string;
}

@ObjectType()
class Bar {
  @Directive("auth", { requires: "USER" })
  @Field()
  field: string;
}

@Resolver()
class FooBarResolver {
  @Directive("@auth(requires: USER)")
  @Query()
  foobar(@Arg("baz") baz: string): string {
    return "foobar";
  }
}
```

> Note that even as directives are a purely SDL thing, they won't appear in the generated schema definition file. Current implementation of directives in TypeGraphQL is using some crazy workarounds because [`graphql-js` doesn't support setting them by code](https://github.com/graphql/graphql-js/issues/1343) and the built-in `printSchema` utility omits the directives while printing.

Also please note that `@Directive` can only contain a single GraphQL directive name or declaration. If you need to have multiple directives declared, just place multiple decorators:

```typescript
@ObjectType()
class Foo {
  @Directive("lowercase")
  @Directive('@deprecated(reason: "Use `newField`")')
  @Directive("hasRole", { role: Role.Manager })
  @Field()
  bar: string;
}
```

### Providing the implementation

Besides declaring the usage of directives, you also have to register the runtime part of the used directives.

> Be aware that TypeGraphQL doesn't have any special way for implementing schema directives. You should use some [3rd party libraries](https://www.apollographql.com/docs/graphql-tools/schema-directives/#implementing-schema-directives) depending on the tool set you use in your project, e.g. `graphql-tools` or `ApolloServer`.

Here is an example using the [`graphql-tools`](https://github.com/apollographql/graphql-tools):

```typescript
import { SchemaDirectiveVisitor } from "graphql-tools";

// build the schema as always
const schema = buildSchemaSync({
  resolvers: [SampleResolver],
});

// register the used directives implementations
SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
  sample: SampleDirective,
});
```
