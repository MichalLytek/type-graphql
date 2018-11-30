---
title: Getting started
---

## Prerequisites

Before you begin, make sure your development environment includes Node.js® and an npm package manager.

## Step 1: Install the TypeGraphQL

First, we need to install the dependency on TypeGraphQL.

```node
npm install type-graphql --save
```

As a dependency on TypeGraphQL, you need to add reflect-metadata skim.

```node
npm install reflect-metadata
```

## Step 2: TypeScript configuration

If you work with tsconfig you have to add in your config file the following:

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

`TypeGraphQL` is designed to work with Node.js 6, 8 and latest stable. It uses features from ES7 (ES2016), so you should set your `tsconfig.json` appropriately:

```json
{
  "target": "es2016" // or newer if your node.js version supports this
}
```

Due to using `graphql-subscription` dependency that relies on an `AsyncIterator`, you may also have to provide the `esnext.asynciterable` to the `lib` option:

```json
{
  "lib": ["es2016", "esnext.asynciterable"]
}
```

All in all, the minimal `tsconfig.json` file example looks like this:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "lib": ["es2016", "esnext.asynciterable"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Step 3: Edit your first TypeGraphQL

To explore all powerful capabilities of TypeGraphQL, we will create a sample GraphQL API for cooking recipes.

Let's start with the `Recipe` type, which is the foundations of our API.

### Types

We want to get equivalent of this type described in SDL:

```graphql
type Recipe {
  id: ID!
  title: String!
  description: String
  creationDate: Date!
  ingredients: [String!]!
}
```

So we create the `Recipe` class with all properties and types:

```typescript
class Recipe {
  id: string;
  title: string;
  description?: string;
  creationDate: Date;
  ingredients: string[];
}
```

Then we decorate the class and it properties with decorators:

```typescript
import { ObjectType, Field } from "type-graphql";

@ObjectType()
class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;

  @Field(type => [String])
  ingredients: string[];
}
```

The detailed rules when to use `nullable`, `array` and others are described in [fields and types docs](./types-and-fields.md).

### Resolvers

After that, we want to create common crud queries and mutation. To do that we create the resolver (controller) class that will have injected `RecipeService` in the constructor:

```typescript
import { Resolver, Query, Args, Mutation, Authorized, Arg, Ctx } from "type-graphql";

@Resolver(Recipe)
class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(returns => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipeService.findById(id);
    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }
    return recipe;
  }

  @Query(returns => [Recipe])
  recipes(@Args() { skip, take }: RecipesArgs) {
    return this.recipeService.findAll({ skip, take });
  }

  @Mutation(returns => Recipe)
  @Authorized()
  addRecipe(
    @Arg("newRecipeData") newRecipeData: NewRecipeInput,
    @Ctx("user") user: User,
  ): Promise<Recipe> {
    return this.recipeService.addNew({ data: newRecipeData, user });
  }

  @Mutation(returns => Boolean)
  @Authorized(Roles.Admin)
  async removeRecipe(@Arg("id") id: string) {
    try {
      await this.recipeService.removeById(id);
      return true;
    } catch {
      return false;
    }
  }
}
```

We use `@Authorized()` decorator to restrict access only for authorised users or the one that fulfils the requirements of the role.
The detailed rules when and why we declare `returns => Recipe` functions and others are described in [resolvers docs](./resolvers.md).

### Inputs and arguments

Ok, but what are `NewRecipeInput` and `RecipesArgs`? They are of course classes:

```typescript
@InputType()
class NewRecipeDataInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @Length(30, 255)
  description?: string;

  @Field(type => [String])
  @MaxArraySize(30)
  ingredients: string[];
}

@ArgsType()
class RecipesArgs {
  @Field(type => Int, { nullable: true })
  @Min(0)
  skip: number = 0;

  @Field(type => Int, { nullable: true })
  @Min(1) @Max(50)
  take: number = 25;
}

```

`@Length`, `@Min` or `@MaxArraySize` are decorators from [`class-validator`](https://github.com/typestack/class-validator) that automatically perform fields validation in TypeGraphQL.

### Building schema
The last step that we have to do is actually to build the schema from the TypeGraphQL definition. We use `buildSchema` function for this:

```typescript
const schema = await buildSchema({
  resolvers: [RecipeResolver]
});

// ...creating express server or sth
```

Et voilà! Now we have fully working GraphQL schema!
If we print it, we will receive exactly this:

```graphql
type Recipe {
  id: ID!
  title: String!
  description: String
  creationDate: Date!
  ingredients: [String!]!
}
input NewRecipeInput {
  title: String!
  description: String
  ingredients: [String!]!
}
type Query {
  recipe(id: ID!): Recipe
  recipes(skip: Int, take: Int): [Recipe!]!
}
type Mutation {
  addRecipe(newRecipeData: NewRecipeInput!): Recipe!
  removeRecipe(id: ID!): Boolean!
}
```

## Next steps

That was only a tip of the iceberg - a very simple example with basic GraphQL types. Do you use [interfaces](./interfaces-and-inheritance.md), [enums](./enums.md), [unions](./unions.md) and custom [scalars](./scalars.md)? That's great because TypeGraphQL fully supports them too! There are also more advanced concepts like [authorization checker](./authorization.md), [inheritance support](./interfaces-and-inheritance.md) or [field resolvers](./resolvers.md).

If you want to see how it looks in a more complicated case, you can go to the [Examples section](./examples.md) where you can find, e.g. how nice TypeGraphQL integrates with TypeORM.
