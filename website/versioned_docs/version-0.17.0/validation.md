---
title: Arguments and inputs validation
sidebar_label: Validation
id: version-0.17.0-validation
original_id: validation
---

## Scalars

The standard way to make sure that the input and arguments are correct, like the `email` field really has an e-mail, is to use [custom scalars](https://github.com/MichalLytek/type-graphql/blob/master/docs/scalars.md) e.g. `GraphQLEmail` from [`graphql-custom-types`](https://github.com/stylesuxx/graphql-custom-types). However creating scalars for all single case of data type (credit card number, base64, IP, URL) might be cumbersome.

And that's why TypeGraphQL has built-in support for validation of arguments and inputs using [`class-validator`](https://github.com/typestack/class-validator) features! You can use awesomeness of decorators to declare the requirement for incoming data (e.g. number is in range 0-255 or password is longer than 8 chars) in an easy way.

## How to use

At first, you have to decorate the input/arguments class with appropriate decorators from `class-validator`. So we take this:

```typescript
@InputType()
export class RecipeInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
```

and produce this:

```typescript
import { MaxLength, Length } from "class-validator";

@InputType()
export class RecipeInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @Length(30, 255)
  description?: string;
}
```

And that's it! 😉

TypeGraphQL will automatically validate your inputs and arguments based on the definitions:

```typescript
@Resolver(of => Recipe)
export class RecipeResolver {
  @Mutation(returns => Recipe)
  async addRecipe(@Arg("input") recipeInput: RecipeInput): Promise<Recipe> {
    // you can be 100% sure that the input is correct
    console.assert(recipeInput.title.length <= 30);
    console.assert(recipeInput.description.length >= 30);
    console.assert(recipeInput.description.length <= 255);
  }
}
```

Of course [there are many more decorators](https://github.com/typestack/class-validator#validation-decorators), not only the simple `@Length` used in the example above, so take a look at `class-validator` documentation.

This feature is enabled by default. However, if you need, you can disable it:

```typescript
const schema = await buildSchema({
  resolvers: [RecipeResolver],
  validate: false, // disable automatic validation or pass default config object
});
```

And if you need, you can still enable it per resolver's argument:

```typescript
class RecipeResolver {
  @Mutation(returns => Recipe)
  async addRecipe(@Arg("input", { validate: true }) recipeInput: RecipeInput) {
    // ...
  }
}
```

You can also pass `ValidatorOptions` object, for setting features like [validation groups](https://github.com/typestack/class-validator#validation-groups):

```typescript
class RecipeResolver {
  @Mutation(returns => Recipe)
  async addRecipe(
    @Arg("input", { validate: { groups: ["admin"] } })
    recipeInput: RecipeInput,
  ) {
    // ...
  }
}
```

Note that by default `skipMissingProperties` setting of `class-validator` is set to `true` because GraphQL will check by itself whether the params/fields exists or not.

GraphQL will also checks whether the fields have correct types (String, Int, Float, Boolean, etc.) so you don't have to use `@IsOptional`, `@Allow`, `@IsString` or `@IsInt` decorators at all!

## Response to the client

When client send incorrect data to the server:

```graphql
mutation ValidationMutation {
  addRecipe(
    input: {
      # too long!
      title: "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
    }
  ) {
    title
    creationDate
  }
}
```

the [`ArgumentValidationError`](https://github.com/MichalLytek/type-graphql/blob/master/src/errors/ArgumentValidationError.ts) will be thrown.

By default, the `apollo-server` package from [bootstrap guide](bootstrap.md) will format the error to match with the `GraphQLFormattedError` interface. So when `ArgumentValidationError` occurs, client will receive this JSON with nice `validationErrors` property inside `extensions.exception`:

```json
{
  "errors": [
    {
      "message": "Argument Validation Error",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["addRecipe"],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "exception": {
          "validationErrors": [
            {
              "target": {
                "title": "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet"
              },
              "value": "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet",
              "property": "title",
              "children": [],
              "constraints": {
                "maxLength": "title must be shorter than or equal to 30 characters"
              }
            }
          ],
          "stacktrace": [
            "Error: Argument Validation Error",
            "    at Object.<anonymous> (F:\\#Projekty\\type-graphql\\src\\resolvers\\validate-arg.ts:29:11)",
            "    at Generator.throw (<anonymous>)",
            "    at rejected (F:\\#Projekty\\type-graphql\\node_modules\\tslib\\tslib.js:105:69)",
            "    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ]
        }
      }
    }
  ],
  "data": null
}
```

Of course you can also create your own custom implementation of the `formatError` function provided to `ApolloServer` config options which will transform the `GraphQLError` with `ValidationError` array to the desired output format (e.g. `extensions.code = "ARGUMENT_VALIDATION_ERROR"`).

## Example

You can see how this fits together in the [simple real life example](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/automatic-validation).
