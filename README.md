![logo](https://github.com/19majkel94/type-graphql/blob/master/logo.png?raw=true)

# TypeGraphQL
[![npm version](https://badge.fury.io/js/type-graphql.svg)](https://badge.fury.io/js/type-graphql)
[![dependencies](https://david-dm.org/19majkel94/type-graphql/status.svg)](https://david-dm.org/19majkel94/type-graphql)
[![gitter](https://badges.gitter.im/type-graphql.svg)](https://gitter.im/type-graphql?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Create GraphQL resolvers and schemas with TypeScript, using classes and decorators!

## Design Goals
We all love GraphQL but creating GraphQL API with TypeScript is a bit of pain.
We have to mantain separate GQL schemas using SDL or JS API and keep the related TypeScript interfaces in sync with them. We also have separate ORM classes representing our db entities. This duplication is a really bad developer experience.

What if I told you that you can have only one source of truth thanks to a little addition of decorators magic?
Interested? So take a look at the quick intro to TypeGraphQL!

## Getting started
Let's start at the begining with an example.
We have API for cooking recipes and we love using GraphQL for it.
At first we will create the `Recipe` type, which is the foundations of our API:

```ts
@GraphQLObjectType()
class Recipe {
  @Field(type => ID)
  readonly id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => Rate)
  ratings: Rate[];

  @Field({ nullable: true })
  averageRating?: number;
}
```
Take a look at the decorators:

- `@GraphQLObjectType()` marks the class as the object shape known from GraphQL SDL as `type`
- `@Field()` marks the property as the object's field - it is also used to collect type metadata from TypeScript reflection system
- the parameter function in decorator `@Field(type => ID)` is used to declare the GraphQL scalar type like the builit-in `ID`
- due to reflection limitation, optional (nullable) fields has to be annotated with `{ nullable: true }` decorator param
- we also have to declare `(type => Rate)` because of limitation of type reflection - emited type of `ratings` property is `Array`, so we need to know what is the type of items in the array

This will generate GraphQL type corresponding to this:
```graphql
type Recipe {
  id: ID!
  title: String!
  description: String
  ratings: [Rate]!
  averageRating: Float
}
```

Next, we need to define what is the `Rate` type:

```ts
@GraphQLObjectType()
class Rate {
  @Field(type => Int)
  value: number;

  @Field()
  date: Date;

  @Field()
  user: User;
}
```
Again, take a look at `@Field(type => Int)` decorator - Javascript doesn't have integers so we have to mark that our number type will be `Int`, not `Float` (which is `number` by default).

-----

So, as we have the base of our recipe related types, let's create a resolver!

We will start by creating a class with apropiate decorator:
```ts
@GraphQLResolver(objectType => Recipe)
export class RecipeResolver {
  // we will implement this later
}
```
`@GraphQLResolver` marks our class as a resolver of type `Recipe` (type info is needed for attaching field resolver to correct type).

Now let's create our first query:
```ts
@GraphQLResolver(objectType => Recipe)
export class RecipeResolver {
  constructor(
    // declare to inject instance of our repository
    private readonly recipeRepository: Repository<Recipe>,
  ){}

  @Query(returnType => Recipe, { nullable: true })
  async recipe(@Args() { recipeId }: FindRecipeArgs): Promise<Recipe | undefined> {
    return this.recipeRepository.findOneById(recipeId);
  }
```
- our query needs to communicate with database, so we declare the repository in constructor and the DI framework will do the magic and injects the instance to our resolver
- `@Query` decorator marks the class method as the query (who would have thought?)
- our method is async, so we can't infer the return type from reflection system - we need to define it as `(returnType => Recipe)` and also mark it as nullable because `findOneById` might not return the recipe (no document with the id in DB)
- `@Args()` marks the parameter as query arguments object, where `FindRecipeArgs` define it's fields - this will be injected in this place to this method

So, how the `FindRecipeArgs` looks like?
```ts
@GraphQLArgumentType()
class FindRecipeArgs {
  @Field(type => ID)
  recipeId: string;
}
```

This two will generate corresponding graphql schema:
```graphql
type Query {
  recipe(recipeId: ID!): Recipe
}
```
It is great, isn't it? :smiley:

Ok, let's add another query:
```ts
class RecipeResolver {
  // ...
  @Query(() => Recipe, { array: true })
  recipes(): Promise<Array<Recipe>> {
    return this.recipeRepository.find();
  }
}
```
As you can see, the function parameter name `@Query(returnType => Recipe)` is only the convention and if you want, you can use the shorthand syntax like `@Query(() => Recipe)` which might be quite less readable for someone. We need to declare it as a function to help resolve circular dependencies.

Also, remember to declare `{ array: true }` when your method is async or returns the `Promise<Array<T>>`.

So now we have two queries in our schema:
```graphql
type Query {
  recipe(recipeId: ID!): Recipe
  recipes: [Recipe]!
}
```

Now let's move to the mutations:
```ts
class RecipeResolver {
  // ...
  @Mutation(returnType => Recipe)
  async rate(
    @Arg("rate") rateInput: RateInput,
    @Context() { user }: Context,
  ) {
    // implementation...
  }
}
```
- we declare the method as mutation using the `@Mutation()` with return type function syntax
- the `@Arg()` decorator let's you declare single argument of the mutation
- for complex arguments you can use as input types like `RateInput` in this case
- injecting the context is also possible - using `@Context()` decorator, so you have an access to `request` or `user` data - whatever you define on server settings

Here's how `RateInput` type looks:
```ts
@GraphQLInputType()
class RateInput {
  @Field(type => ID)
  recipeId: string;

  @Field(type => Int)
  value: number;
}
```
`@GraphQLInputType()` marks the class as the `input` in SDL, in oposite to `type` or `scalar`

The corresponding GraphQL schema:
```graphql
input RateInput {
  recipeId: ID!
  value: Int!
}
```

And the rate mutation definition:
```graphql
type Mutation {
  rate(rate: RateInput!): Recipe!
}
```

The last one we discuss now is the field resolver. As we declared earlier, we store array of ratings in our recipe documents and we want to expose the average rating value.

So all we need is to decorate the method with `@FieldResolver()` and the method parameter with `@Root()` decorator with the root value type of `Recipe` - as simple as that!

```ts
class RecipeResolver {
  // ...
  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    // implementation...
  }
}
```

The whole `RecipeResolver` we discussed above with sample implementation of methods looks like this:
```ts
@GraphQLResolver(objectType => Recipe)
export class RecipeResolver {
  constructor(
    // inject the repository (or other services)
    private readonly recipeRepository: Repository<Recipe>,
  ){}

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Args() { recipeId }: FindRecipeParams) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(() => Recipe, { array: true })
  recipes(): Promise<Array<Recipe>> {
    return this.recipeRepository.find();
  }

  @Mutation(Recipe)
  async rate(
    @Arg("rate") rateInput: RateInput,
    @Context() { user }: Context,
  ) {
    // find the document
    const recipe = await this.recipeRepository.findOneById(rateInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // update the document
    recipe.ratings.push({
      date: new Date(),
      value: rateInput.value,
      user,
    });

    // and save it
    return this.recipeRepository.save(recipe);
  }

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    const ratingsCount = recipe.ratings.length;
    const ratingsSum = recipe.ratings
      .map(rating => rating.value)
      .reduce((a, b) => a + b, 0);

    return ratingsCount ? ratingsSum / ratingsCount : null;
  }
}
```

### Real life example

As I mentioned, in real life we want to reuse as much TypeScript definition as we can.
So the GQL type classes would be also reused by ORM or validation lib:

```ts
import { Entity, ObjectIdColumn, Column, OneToMany, CreateDateColumn } from "typeorm";

@Entity()
@GraphQLObjectType()
export class Recipe {
  @ObjectIdColumn()
  @Field(type => ID)
  readonly id: ObjectId;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @OneToMany(type => Rate, rate => rate.recipe)
  @Field(type => Rate)
  ratings: Rate[];

  // note that this field is not stored in DB
  @Field()
  averageRating: number;

  // and this one is not exposed by GraphQL
  @CreateDateColumn()
  creationDate: Date;
}
```

```ts
import { IsMongoId, Min, Max } from "class-validator";

@GraphQLInputType()
class RateInput {
  @IsMongoId()
  @Field(type => ID)
  recipeId: string;

  @Min(1)
  @Max(5)
  @Field(type => Int)
  value: number;
}
```

Of course TypeGraphQL will automatically validate the input and params with `class-validator` for you too!

More details about this feature [here](https://github.com/19majkel94/type-graphql/blob/master/docs/validation.md).

## How to use

### Installation

1. Install module:
```
npm i type-graphql
```

2. reflect-metadata shim is required:
```
npm i reflect-metadata
```

and make sure to import it on top of your entry file (before you use/import `type-graphql` or your resolvers):
```ts
import "reflect-metadata";
```

3. Its important to set these options in tsconfig.json file of your project:
```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

### Usage
All you need to do is to import your resolvers and register them in schema builder:
```ts
import { buildSchema } from "type-graphql";

import { SampleResolver } from "./resolvers";

const schema = buildSchema({
  resolvers: [SampleResolver],
});

```
And that's it! You can also create a HTTP-based GraphQL API server:
```ts
// remember to install "express" and "express-graphql" modules!
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema, // this is our schema from TypeGraphQL
    graphiql: true,
  }),
);
app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});
```

## Examples
You can also check the [examples](https://github.com/19majkel94/type-graphql/tree/master/examples) folder on the repo for more example of usage: simple fields resolvers, DI Container support, etc.
Please notice that, do tue a [ts-node bug](https://github.com/rbuckton/reflect-metadata/issues/84) an additional parameter is needed when running with ts-node:
```bash
ts-node --type-check examples/01-simple-usage/index.ts 
```


[Tests](https://github.com/19majkel94/type-graphql/tree/master/tests) folder will also give you some tips how to make some things done.

## Work in progress

Currently released version is an early alpha. However it's working quite well, so please feel free to test it and experiment with it.

More feedback = less bugs thanks to you! :smiley:

## Contribution
PRs are welcome, but first check, test and build your code before committing it.
* Use commit rules: For more information checkout this [commit rule guide](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).
* [Allowing changes to a pull request branch created from a fork](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/)

## Roadmap
You can keep track of [development's progress on project board](https://github.com/19majkel94/type-graphql/projects/1).

Stay tuned and come back later for more! :wink:
