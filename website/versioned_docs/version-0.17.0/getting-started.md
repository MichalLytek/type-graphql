---
title: Getting started
id: version-0.17.0-getting-started
original_id: getting-started
---

> Make sure that you've completed all the steps described in the [installation instruction](installation.md).

To explore all powerful capabilities of TypeGraphQL, we will create a sample GraphQL API for cooking recipes.

Let's start with the `Recipe` type, which is the foundations of our API.

## Types

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

Then we decorate the class and its properties with decorators:

```typescript
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

The detailed rules when to use `nullable`, `array` and others are described in [fields and types docs](types-and-fields.md).

## Resolvers

After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class that will have injected `RecipeService` in constructor:

```typescript
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

We use `@Authorized()` decorator to restrict access only for authorized users or the one that fulfil the roles requirements.
The detailed rules when and why we declare `returns => Recipe` functions and others are described in [resolvers docs](resolvers.md).

## Inputs and arguments

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
  @Field(type => Int)
  @Min(0)
  skip: number = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}
```

`@Length`, `@Min` or `@MaxArraySize` are decorators from [`class-validator`](https://github.com/typestack/class-validator) that automatically perform fields validation in TypeGraphQL.

## Building schema

The last step that we have to do is to actually build the schema from TypeGraphQL definition. We use `buildSchema` function for this:

```typescript
const schema = await buildSchema({
  resolvers: [RecipeResolver],
});

// ...creating express server or sth
```

Et voilà! Now we have fully working GraphQL schema!
If we print it, we would receive exactly this:

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
  recipes(skip: Int = 0, take: Int = 25): [Recipe!]!
}
type Mutation {
  addRecipe(newRecipeData: NewRecipeInput!): Recipe!
  removeRecipe(id: ID!): Boolean!
}
```

## Want more?

That was only a tip of the iceberg - a very simple example with basic GraphQL types. Do you use interfaces, enums, unions and custom scalars? That's great because TypeGraphQL fully supports them too! There are also more advanced concepts like authorization checker, inheritance support or field resolvers.

If you want to see how it looks in more complicated case, you can go to the [Examples section](examples.md) where you can find e.g. how nice TypeGraphQL integrates with TypeORM.
