![logo](https://github.com/19majkel94/type-graphql/blob/master/logo.png?raw=true)

# TypeGraphQL
Create GraphQL resolvers and schemas with TypeScript!

## Work in progress
Please come back later! :wink:
However, you can now see the API draft.

## API Draft

Let's start at the begining with an example.

We have API for cooking recipes and we love using GraphQL for it.
However, mantaining separate schemas (using SDL) with ORM classes and typescript interfaces is a bad developer experience.
What if I told you that you can have only one source of truth with a little addition of decorators magic?
Interested? So take a look at the quick intro to TypeGraphQL!

At first we will create the `Recipe` type, which is the foundations of our API:

```ts
@GraphQLType()
class Recipe {
  @Field(type => ID)
  readonly id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => Rate)
  ratings: Rate[];

  @Field()
  averageRating: number;
}
```
Take a look at the decorators:

- `@GraphQLType()` marks the class as the `type` shape known from GraphQL SDL
- `@Field()` marks the property as type field - it is also used to collect type metadata from TypeScript reflection system
- the parameter in `@Field(type => ID)` is used to declare the GraphQL scalar type like the builit-in `ID`
- we also have to declare `(type => Rate)` because of limitation of type reflection - emited type of `ratings` property is `Array`, so we need to know what is the type of items in the array

This will generate GraphQL type corresponding to this:
```graphql
type Recipe {
  id: ID!
  title: String!
  description: String
  ratings: [Rate]!
  averageRating: Float!
}
```

Then, we need to define what is the `Rate` type:

```ts
@GraphQLType()
class Rate {
  @Field(type => Int)
  value: number;

  @Field()
  date: Date;

  @Field()
  user: User;
}
```
Again, take a look at `@Field(type => Int)` decorator - Javascript doesn't have integers so we have to mark that our number type will be `Int`, not `Float` (which is number by default).

-----

So, as we have the base of our recipe related types, let's create a resolver!

We will start by creating a class with apropiate decorator:
```ts
@GraphQLResolver(Recipe)
export class RecipeResolver implements Resolver<Recipe> {
  // we will implement this later
}
```
`@GraphQLResolver` marks our class as a resolver of type `Recipe` (type info is needed for attaching field resolver to correct type). We can also implement `Resolver` interface to make sure that our field resolvers are correct.

Now let's create our first query:
```ts
@GraphQLResolver(Recipe)
export class RecipeResolver implements Resolver<Recipe> {
  constructor(
    // declare to inject instance of our repository
    private readonly recipeRepository: Repository<Recipe>,
  ){}

  @Query(returnType => Recipe, { nullable: true })
  async recipe(@Arguments() { recipeId }: FindRecipeArgs) {
    return this.recipeRepository.findOneById(recipeId);
  }
```
- our query needs to communicate with database, so we declare the repository in constructor and the DI framework will do the magic and injects the instance to our resolver
- `@Query` decorator marks the class method as the query (who would have thought?)
- our method is async, so we can't infer the return type from reflection system - we need to define it as `(returnType => Recipe)` and also mark it as nullable because `findOneById` might not return the recipe (no document with the id in DB)
- `@Arguments()` marks the parameter as query arguments object, where `FindRecipeArgs` define it's fields - this will be injected in this place to this method

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

Ok, let's add another one query:
```ts
class RecipeResolver {
  // ...
  @Query(Recipe, { array: true })
  recipes(): Promise<Array<Recipe>> {
    return this.recipeRepository.find();
  }
}
```
As you can see, the function `@Query(returnType => Recipe)` is only the convention (that helps resolve circular dependencies btw) and if you want, you can use the shorthand syntax like `@Query(Recipe)` which might be quite less readable for someone. Remember to declare `{ array: true }` if your method is async or returns the `Promise`.

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
  @Mutation(Recipe)
  @Authorized()
  async rate(
    @Argument("rate") rateInput: RateInput,
    @Context() { user }: Context,
  ) {
    // implementation...
  }
}
```
- we declare the method as mutation using the `@Mutation` with shorthand return type syntax
- as we allow only logged users to rate the recipe, we declare the `@Authorized()` on the mutation which will revoke access to the mutation for guests (it accepts also the roles as argument for complex authorizations)
- the `@Argument()` decorator let's you declare single argument of the mutation
- for complex arguments you can use as input types like `RateInput` in this case
- injecting the context is also possible - using `@Context()` decorator, so you have an access to `request` or `user` data

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
`@GraphQLInputType()` marks the class as the `input` in SDL, oposite to `type` or `scalar`

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

The last one we discuss now is the field resolver. Let's assume we store array of ratings in our recipe documents and we want to expose the average rating value.

```ts
class RecipeResolver {
  // ...
  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    // implementation...
  }
}
```
All we need is to decorate the method with `@FieldResolver()` and the method parameter with `@Root()` decorator with the root value type of `Recipe` - as simple as that!

The whole `RecipeResolver` we discussed above with sample implementation of methods looks like this:
```ts
@GraphQLResolver(Recipe)
export class RecipeResolver implements Resolver<Recipe> {
  constructor(
    // inject the repository (or other services)
    private readonly recipeRepository: Repository<Recipe>,
  ){}

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Arguments() { recipeId }: FindRecipeParams) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(Recipe, { array: true })
  recipes(): Promise<Array<Recipe>> {
    return this.recipeRepository.find();
  }

  @Authorized()
  @Mutation(Recipe)
  async rate(
    @Argument("rate") rateInput: RateInput,
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

    return ratingsCount ? ratingsSum / ratingsCount : 0;
  }
}
```

As I mentioned, in real life we want to reuse as much TypeScript definition as we can.
So the GQL types would be also used by ORM and the inputs/params would be validated:

```ts
import { Entity, ObjectIdColumn, Column, OneToMany, CreateDateColumn } from "typeorm";

@Entity()
@GraphQLType()
export class Recipe {
  @ObjectIdColumn()
  @Field(type => ID)
  readonly id: ObjectId;

  @Column()
  @Field()
  title: string;

  @Field()
  @Column()
  description: string;

  @OneToMany(type => Rate, rate => rate.recipe)
  @Field(type => Rate)
  ratings: Rate[];

  // note that this field is not stored in DB
  @Field(type => Float)
  averageRating: number;

  // and this one is not exposed by GraphQL
  @CreateDateColumn()
  creationDate: Date;
}
```

```ts
import { Length, Min, Max } from "class-validator";

@GraphQLInputType()
class RateInput {
  @Length(24)
  @Field(type => ID)
  recipeId: string;

  @Min(1)
  @Max(5)
  @Field(type => Int)
  value: number;
}
```

Of course TypeGraphQL will validate the input and params with `class-validator` for you too!

Stay tuned, come later for more! :wink:
