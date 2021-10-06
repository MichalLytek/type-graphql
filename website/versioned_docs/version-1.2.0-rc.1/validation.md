---
title: Argument and Input validation
sidebar_label: Validation
id: version-1.2.0-rc.1-validation
original_id: validation
---

## Scalars

The standard way to ensure that inputs and arguments are correct, such as an `email` field that really contains a proper e-mail address, is to use [custom scalars](https://github.com/MichalLytek/type-graphql/blob/master/docs/scalars.md) e.g. `GraphQLEmail` from [`graphql-custom-types`](https://github.com/stylesuxx/graphql-custom-types). However, creating scalars for all single cases of data types (credit card number, base64, IP, URL) might be cumbersome.

That's why TypeGraphQL has built-in support for argument and input validation.
By default, we can use the [`class-validator`](https://github.com/typestack/class-validator) library and easily declare the requirements for incoming data (e.g. a number is in the range 0-255 or a password that is longer than 8 characters) thanks to the awesomeness of decorators.

We can also use other libraries or our own custom solution, as described in [custom validators](#custom-validators) section.

## `class-validator`

### How to use

First we decorate the input/arguments class with the appropriate decorators from `class-validator`.
So we take this:

```typescript
@InputType()
export class RecipeInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
```

...and turn it into this:

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

TypeGraphQL will automatically validate our inputs and arguments based on the definitions:

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

Of course, [there are many more decorators](https://github.com/typestack/class-validator#validation-decorators) we have access to, not just the simple `@Length` decorator used in the example above, so take a look at the `class-validator` documentation.

This feature is enabled by default. However, we can disable it if we must:

```typescript
const schema = await buildSchema({
  resolvers: [RecipeResolver],
  validate: false, // disable automatic validation or pass the default config object
});
```

And we can still enable it per resolver's argument if we need to:

```typescript
class RecipeResolver {
  @Mutation(returns => Recipe)
  async addRecipe(@Arg("input", { validate: true }) recipeInput: RecipeInput) {
    // ...
  }
}
```

The `ValidatorOptions` object used for setting features like [validation groups](https://github.com/typestack/class-validator#validation-groups) can also be passed:

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

Note that by default, the `skipMissingProperties` setting of the `class-validator` is set to `true` because GraphQL will independently check whether the params/fields exist or not.

GraphQL will also check whether the fields have correct types (String, Int, Float, Boolean, etc.) so we don't have to use the `@IsOptional`, `@Allow`, `@IsString` or the `@IsInt` decorators at all!

However, when using nested input or arrays, we always have to use [`@ValidateNested()` decorator](https://github.com/typestack/class-validator#validating-nested-objects) or [`{ each: true }` option](https://github.com/typestack/class-validator#validating-arrays) to make nested validation work properly.

### Response to the Client

When a client sends incorrect data to the server:

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

By default, the `apollo-server` package from the [bootstrap guide](bootstrap.md) will format the error to match the `GraphQLFormattedError` interface. So when the `ArgumentValidationError` occurs, the client will receive this JSON with a nice `validationErrors` property inside of `extensions.exception`:

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

Of course we can also create our own custom implementation of the `formatError` function provided in the `ApolloServer` config options which will transform the `GraphQLError` with a `ValidationError` array in the desired output format (e.g. `extensions.code = "ARGUMENT_VALIDATION_ERROR"`).

### Example

To see how this works, check out the [simple real life example](https://github.com/MichalLytek/type-graphql/tree/master/examples/automatic-validation).

### Caveats

Even if we don't use the validation feature (and we have provided `{ validate: false }` option to `buildSchema`), we still need to have `class-validator` installed as a dev dependency in order to compile our app without errors using `tsc`.

An alternative solution that allows to completely get rid off big `class-validator` from our project's `node_modules` folder is to suppress the `error TS2307: Cannot find module 'class-validator'` TS error by providing `"skipLibCheck": true` setting in `tsconfig.json`.

## Custom validator

We can also use other libraries than `class-validator` together with TypeGraphQL.

To integrate it, all we need to do is to provide a custom function as `validate` option in `buildSchema`.
It receives two parameters:

- `argValue` which is the injected value of `@Arg()` or `@Args()`
- `argType` which is a runtime type information (e.g. `String` or `RecipeInput`).

The `validate` function can be async and should return nothing (`void`) when validation passes or throw an error when validation fails.
So be aware of this while trying to wrap another library in `validate` function for TypeGraphQL.

Example using [decorators library for Joi validators (`joiful`)](https://github.com/joiful-ts/joiful):

```ts
const schema = await buildSchema({
  // ...other options
  validate: argValue => {
    // call joiful validate
    const { error } = joiful.validate(argValue);
    if (error) {
      // throw error on failed validation
      throw error;
    }
  },
});
```

> Be aware that when using custom validator, the error won't be wrapped with `ArgumentValidationError` like for the built-in `class-validator` validation.

### Example

To see how this works, check out the [simple custom validation integration example](https://github.com/MichalLytek/type-graphql/tree/master/examples/custom-validation).
