---
title: Directives
---

> A directive is an identifier preceded by a `@` character, optionally followed by a list of named arguments, which can appear after almost any form of syntax in the GraphQL query or schema languages.

Though the [GraphQL directives](https://www.apollographql.com/docs/graphql-tools/schema-directives) syntax is similar to TS decorators, they are purely an SDL (Schema Definition Language) feature that allows you to add metadata to a selected type or its field:

```graphql
type Foo @auth(requires: USER) {
  field: String!
}

type Bar {
  field: String! @auth(requires: USER)
}
```

That metadata can be read at runtime to modify the structure and behavior of a GraphQL schema to support reusable code and tasks like authentication, permission, formatting, and plenty more. They are also really useful for some external services like [Apollo Cache Control](https://www.apollographql.com/docs/apollo-server/performance/caching/#adding-cache-hints-statically-in-your-schema) or [Apollo Federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/#federated-schema-example).

**TypeGraphQL** of course provides some basic support for using the schema directives via the `@Directive` decorator.

## Usage

### Declaring in schema

Basically, we declare the usage of directives just like in SDL, with the `@` syntax:

```ts
@Directive('@deprecated(reason: "Use newField")')
```

Currently, you can use the directives only on object types, input types, interface types and their fields or fields resolvers, args type fields, as well as queries, mutations and subscriptions and the inline arguments. Other locations like scalars, enums or unions are not yet supported.

So the `@Directive` decorator can be placed over the class property/method or over the type class itself, depending on the needs and the placements supported by the implementation:

```ts
@Directive("@auth(requires: USER)")
@ObjectType()
class Foo {
  @Field()
  field: string;
}

@ObjectType()
class Bar {
  @Directive("@auth(requires: USER)")
  @Field()
  field: string;
}

@ArgsType()
class FooBarArgs {
  @Directive('@deprecated(reason: "Not used anymore")')
  @Field({ nullable: true })
  baz?: string;
}

@Resolver(of => Foo)
class FooBarResolver {
  @Directive("@auth(requires: ANY)")
  @Query()
  foobar(@Args() { baz }: FooBarArgs): string {
    return "foobar";
  }

  @Directive("@auth(requires: ADMIN)")
  @FieldResolver()
  bar(): string {
    return "foobar";
  }
}
```

In case of inline args using `@Arg` decorator, directives can be placed over the parameter of the class method:

```ts
@Resolver(of => Foo)
class FooBarResolver {
  @Query()
  foo(
    @Directive('@deprecated(reason: "Not used anymore")')
    @Arg("foobar", { defaultValue: "foobar" })
    foobar: string,
  ) {
    return "foo";
  }

  @FieldResolver()
  bar(
    @Directive('@deprecated(reason: "Not used anymore")')
    @Arg("foobar", { defaultValue: "foobar" })
    foobar: string,
  ) {
    return "bar";
  }
}
```

> Note that even as directives are a purely SDL thing, they won't appear in the generated schema definition file. Current implementation of directives in TypeGraphQL is using some crazy workarounds because [`graphql-js` doesn't support setting them by code](https://github.com/graphql/graphql-js/issues/1343) and the built-in `printSchema` utility omits the directives while printing. See [emit schema with custom directives](./emit-schema.md#emit-schema-with-custom-directives) for more info.

Also please note that `@Directive` can only contain a single GraphQL directive name or declaration. If you need to have multiple directives declared, just place multiple decorators:

```ts
@ObjectType()
class Foo {
  @Directive("@lowercase")
  @Directive('@deprecated(reason: "Use `newField`")')
  @Directive("@hasRole(role: Manager)")
  @Field()
  bar: string;
}
```

### Providing the implementation

Besides declaring the usage of directives, you also have to register the runtime part of the used directives.

> Be aware that TypeGraphQL doesn't have any special way for implementing schema directives. You should use some [3rd party libraries](https://the-guild.dev/graphql/tools/docs/schema-directives#implementing-schema-directives) depending on the tool set you use in your project, e.g. `@graphql-tools/*` or `ApolloServer`.

If you write your custom GraphQL directive or import a package that exports a `GraphQLDirective` instance, you need to register the directives definitions in the `buildSchema` options:

```ts
// Build TypeGraphQL executable schema
const tempSchema = await buildSchema({
  resolvers: [SampleResolver],
  // Register the directives definitions
  directives: [myDirective],
});
```

Then you need to apply the schema transformer for your directive, that implements the desired logic of your directive:

```ts
// Transform and obtain the final schema
const schema = myDirectiveTransformer(tempSchema);
```

If the directive package used by you exports a string-based `typeDefs`, you need to add those typedefs to the schema and then apply directive transformer.

Here is an example using the [`@graphql-tools/*`](https://the-guild.dev/graphql/tools):

```ts
import { mergeSchemas } from "@graphql-tools/schema";
import { renameDirective } from "fake-rename-directive-package";

// Build TypeGraphQL executable schema
const schemaSimple = await buildSchema({
  resolvers: [SampleResolver],
});

// Merge schema with sample directive type definitions
const schemaMerged = mergeSchemas({
  schemas: [schemaSimple],
  // Register the directives definitions
  typeDefs: [renameDirective.typeDefs],
});

// Transform and obtain the final schema
const schema = renameDirective.transformer(schemaMerged);
```
