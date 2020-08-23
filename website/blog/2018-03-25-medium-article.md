---
title: GraphQL + TypeScript = TypeGraphQL
author: Michał Lytek
authorURL: https://github.com/MichalLytek
authorImageURL: /img/author.jpg
---

We all love GraphQL! It’s so great and solves many problems that we have with REST API, like overfetching and underfetching. But developing a GraphQL API in Node.js with TypeScript is sometimes a bit of pain.

**TypeGraphQL** makes that process enjoyable, i.a. by defining the schema using only classes and a bit of decorators magic.

<!--truncate-->

![type-graphql-logo](/blog/assets/logo_mini.png)

## Motivation
As I mentioned, developing a GraphQL API in Node.js with TypeScript might be a painful process. Why? Let’s take a look at the steps we usually have to make.

At first, we create the all the schema types in SDL. We also create our data models using ORM classes, which represents our db entities. Then we start to write resolvers for our queries, mutations and fields but this force us to begin with creating TS interfaces for all arguments and inputs or even object types. And after that we can actually implements the resolvers, using weird generic signatures, e.g.:

```typescript
export const recipesResolver: GraphQLFieldResolver<void, Context, RecipesArgs> =
  async (_, args) => {
    // stuffs like validation, auth checking, getting from container
    // and our business logic, e.g.:
    const repository = getRepository(Recipe);
    return repository.find();
  }
```
The biggest problem is the rendundancy in our codebase, that makes difficult to keep this things in sync. To add new field to our entity, we have to jump through all the files — modify entity class, then modify part of the schema and then update the interface. The same goes with inputs or arguments, it’s easy to forget to update one or make a mistake with the type. Also, what if we’ve made a typo in field name? The rename feature (F2) won’t work correctly.

**TypeGraphQL** comes to address this issues, based on experience from over a dozen months of developing GraphQL APIs in TypeScript. The main idea is to have only one source of truth by defining the schema using classes and a bit of decorators help. Additional features like dependency injection, validation or auth guards helps with common task that normally we would have to handle by ourselves.

## Getting started
To explore all powerful capabilities of TypeGraphQL, we will create a sample GraphQL API for cooking recipes.

Let’s start with the Recipe type, which is the foundations of our API. 
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

So we create the Recipe class with all properties and types:
```typescript
class Recipe {
  id: string;
  title: string;
  description?: string;
  creationDate: Date;
  ingredients: string[];
}
```

Then we annotate the class and it properties with decorators:
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

The detailed rules when to use `nullable`, `array` and other options are described in [fields and types docs](https://github.com/MichalLytek/type-graphql/blob/master/docs/types-and-fields.md).

### Resolvers
After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class that will have injected RecipeService in constructor:
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

We use `@Authorized()` decorator to restrict access only for authorized users or the one that fulfill the roles requirements. The detailed rules when and why we declare `returns => Recipe` functions and others are described in [resolvers docs](https://github.com/MichalLytek/type-graphql/blob/master/docs/resolvers.md).

### Inputs and arguments
Ok, but what are theNewRecipeInput and RecipesArgs? There are of course classes that declares input type and arguments:
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
The last step that we have to do is to actually build the schema from TypeGraphQL definition. We use buildSchema function for this:
```typescript
const schema = await buildSchema({
  resolvers: [RecipeResolver]
});

// ...creating express server or sth
```

Et voilà! Now we have fully working GraphQL schema! If we print it, we would receive exactly this:
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

## Want more?
That was only a tip of the iceberg — a very simple example with basic GraphQL types. Do you use interfaces, enums, unions and custom scalars? That’s great because TypeGraphQL fully supports them too!

If you want to see how it looks in more complicated case, you can go to the [Examples section](https://github.com/MichalLytek/type-graphql/blob/master/examples) where you can find how nice TypeGraphQL integrates with TypeORM. Want to learn about more advanced concepts like authorization checker, inheritance support or field resolvers? Check out the [Docs section](https://github.com/MichalLytek/type-graphql/blob/master/docs).

## Work in progress
Currently released version is a **MVP** (Minimum Viable Product). It is well tested (95% coverage, 4400 lines of test code) and has 90% of the planned features already implemented. However there’s some work to be done before 1.0.0 release and it’s mostly about documentation (website, api reference and jsdoc).

There are also plans for more features like better TypeORM and dataloader integration or middlewares and custom decorators support — [the full list of ideas](https://github.com/MichalLytek/type-graphql/issues?q=is%3Aissue+is%3Aopen+label%3A%22Enhancement+%3Anew%3A%22) is available on the GitHub repo. You can also keep track of [development’s progress on project board](https://github.com/MichalLytek/type-graphql/projects/1).

## Spread the word
I strongly encourage you to give it a try and experiment with **TypeGraphQL**.
I promise, it will reduce your codebase by a half or more!

If you find this framework interesting, please [star the GitHub repository](https://github.com/MichalLytek/type-graphql), clap for this article and share it on your social media, if you don’t mind.

The more feedback I receive, the more time I will devote to continue the development of TypeGraphQL!
