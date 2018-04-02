---
title: Resolvers
---

Besides [declaring GraphQL's object types](./types-and-fields.md), TypeGraphQL allows to create queries, mutations and field resolvers in an easy way - like a normal class methods, similar to REST controllers in frameworks like Java's `Spring`, .NET `Web API` or TypeScript's [routing-controllers](https://github.com/typestack/routing-controllers).

## Queries and mutations

### Resolvers classes
At first, you have to create a resolver class and annotate it with `@Resolver()` decorator. This class will behave like a controller known from classic REST frameworks:
```ts
@Resolver()
class RecipeResolver {

}
```

You can use DI framework (as described in [dependency injection docs](./dependency-injection.md)) to inject class dependencies (like services or repositories) or store data inside resolvers class - it's guaranteed to be a single instance per app.
```ts
@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];
}
```

Then you can create class methods which will handle queries and mutations. For example let's add `recipes` query that will return a collection of all recipes:
```ts
@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];

  async recipes() {
    // fake async in this example
    return await this.recipesCollection;
  }
}
```

We also need to do two things.
The first is to add `@Query` decorator (it marks the class method as the GraphQL's query).
The second is to provide the return type - the method is async so reflection metadata system shows that the return type is `Promise` of sth, so we have to add `returns => [Recipe]` decorator's parameter to declare that it will be an array of `Recipe` object types.
```ts
@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];

  @Query(returns => [Recipe])
  async recipes() {
    return await this.recipesCollection;
  }
}
```

### Arguments
Usually queries have some arguments - it might be an id of the resource, the search phrase or pagination settings. TypeGraphQL allows you to define the arguments in two ways.

First is the inline method using `@Arg()` decorator. The drawback is the need of repeating argument name (reflection system limitation) in decorator parameter.
```ts
@Resolver()
class RecipeResolver {
  // ...
  @Query(returns => [Recipe])
  async recipes(
    @Arg("title" { nullable: true }) title?: string,
  ): Promise<Recipe[]> {
    // ...
  }
}
```
It's quite good when there are up to 2-3 args but when you have many more, the resolver's method definitions becomes bloated. In that case you can use the args class definition. It looks like the object type class but it has `@ArgsType()` decorator on top.
```ts
@ArgsType()
class GetRecipesArgs {
  @Field(type => Int, { nullable: true })
  skip?: number;

  @Field(type => Int, { nullable: true })
  take?: number;

  @Field({ nullable: true })
  title?: string;
}
```
You can define default values for optional fields (remember about `nullable: true`!) as well as helper methods.
Also, this way of declaring arguments allows you to perform its validation - more details about this feature you can find in [validation docs](./validation.md).

```ts
@ArgsType()
class GetRecipesArgs {
  @Field(type => Int, { nullable: true })
  @Min(0)
  skip = 0;

  @Field(type => Int, { nullable: true })
  @Min(1) @Max(50)
  take = 25;

  @Field({ nullable: true })
  title?: string;

  // helpers - index calculations
  startIndex = skip;
  endIndex = skip + take;
}
```

Then all that left to do is to use the args class as the type of the method parameter.
We can use the destruction syntax to have access to single arguments as variables, instead of the reference to the whole args object.
```ts
@Resolver()
class RecipeResolver {
  // ...
  @Query(returns => [Recipe])
  async recipes(@Args() { title, startIndex, endIndex }: GetRecipesArgs) {
    // sample implementation
    let recipes = this.recipesCollection;
    if (title) {
      recipes = this.recipesCollection.filter(recipe => recipe.title === title)
    }
    return recipes.slice(startIndex, endIndex);
  }
}
```

This declarations will result in the following part of the schema in SDL:
```graphql
type Query {
  recipes(skip: Int, take: Int, title: String): [Recipe!]
}
```

### Input types
GraphQL's mutations we can create analogously, by declaring the class method, using `@Mutation` decorator, providing return type (if needed), creating arguments, etc. But for mutation we usually use `input` types, hence why TypeGraphQL allows you to create inputs in the same way as the [object types](./types-and-fields.md) but using `@InputType()` decorator:
```ts
@InputType()
class AddRecipeInput {

}
```

We can also leverage TypeScript type checking system and ensure that we won't accidentally change the property type by implementing `Partial` type:
```ts
@InputType()
class AddRecipeInput implements Partial<Recipe> {
  
}
```

Then we can declare all the input fields we would need, using `@Field()` decorator:
```ts
@InputType({ description: "New recipe data" })
class AddRecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
```

Then we can use the `AddRecipeInput` type in our mutation. We can do this inline (using `@Arg()` decorator) or as a field of the args class like in query's example above.

We might also need access to the context. To achieve this we use `@Ctx()` decorator with optional user-defined `Context` interface:
```ts
@Resolver()
class RecipeResolver {
  // ...
  @Mutation()
  addRecipe(
    @Arg("data") newRecipeData: AddRecipeInput,
    @Ctx() ctx: Context,
  ): Recipe {
    // sample implementation
    const recipe = RecipesUtils.create(newRecipeData, ctx.user);
    this.recipesCollection.push(recipe);
    return recipe;
  }
}
```
Because our method is synchronous and explicitly returns `Recipe`, we can omit `@Mutation()` type annotation.

This declarations will result in the following parts of the schema in SDL:
```graphql
input AddRecipeInput {
  title: String!
  description: String
}
```
```graphql
type Query {
  addRecipe(data: AddRecipeInput!): Recipe!
}
```

By using parameter decorators, we can get rid of the unnecessary parameters like root value that bloat our method definition and have to be ignored with `_` parameter name. Also, we can achieve clean separation between GraphQL and our business code with decorators abstraction, so our resolvers and their methods behave just like services which we can easily unit-test.

## Field resolvers
Queries and mutations are not the only type of resolvers. We often create object type's field resolvers, e.g. when `user` type has field `posts` which we have to resolve by fetching relation data from the database.

Field resolvers in TypeGraphQL are very similar to queries and mutations - we create them as method of the resolver class but with a few modification. Firstly, we need to declare which object type's fields we are resolving by providing the type to `@Resolver` decorator:
```ts
@Resolver(objectType => Recipe)
class RecipeResolver {
  // queries and mutations
}
```

Then we can create the class method that become field resolver.
In our example we have `averageRating` field in `Recipe` object type that should calculate the average from the `ratings` array.
```ts
@Resolver(objectType => Recipe)
class RecipeResolver {
  // queries and mutations

  averageRating(recipe: Recipe) {
    // ...
  }
}
```

We need to mark the method as field resolver with `@FieldResolver()` decorator. Because we've defined the type of the field in `Recipe` class definition, there's no need to do this again. We also need to decorate the method's parameters with `@Root` to inject the recipe object.
```ts
@Resolver(objectType => Recipe)
class RecipeResolver {
  // queries and mutations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    // ...
  }
}
```

For enhanced type-safe you can implement the `ResolverInterface<Recipe>`.
It's a small helper that will check if the return type of e.g. `averageRating` method is matching the `averageRating` property of the `Recipe` class
and whether the first parameter of the method is the object type (`Recipe` class).
```ts
@Resolver(objectType => Recipe)
class RecipeResolver implements ResolverInterface<Recipe> {
  // queries and mutations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    // ...
  }
}
```

Example implementation of the `averageRating` field resolver:
```ts
@Resolver(objectType => Recipe)
class RecipeResolver implements ResolverInterface<Recipe> {
  // queries and mutations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    const ratingsSum = recipe.ratings.reduce((a, b) => a + b, 0);
    return recipe.ratings.length
      ? ratingsSum / recipe.ratings.length
      : undefined;
  }
}
```

For simple resolvers like `averageRating` calculation or deprecated fields that behave like aliases, you can create the field resolvers inline in object type's class definition:

```ts
@ObjectType()
class Recipe {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ deprecationReason: "Use `title` instead" })
  get name(): string { 
    return this.title;
  }

  @Field()
  ratings: Rate[];

  @Field()
  author: User;

  @Field(type => Float, { nullable: true })
  averageRating(@Arg("since") sinceDate: Date): number | null {
    const ratings = this.ratings.filter(rate => rate.date > sinceDate);
    if (!ratings.length) return null;

    const ratingsSum = ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratings.length;
  };
}
```

However, use this way of creating field resolvers only if the implementation is simple.
If the code is more complicated and perform side effects (api call, db fetching), use resolver class's method instead - you can leverage dependency injection mechanism, really helpful in testing:

```ts
@Resolver(objectType => Recipe)
class RecipeResolver implements ResolverInterface<Recipe> {
  constructor(
    private userRepository: Repository<User>, // dependency injection
  ) {}

  @FieldResolver()
  async author(@Root() recipe: Recipe) {
    const author = await this.userRepository.findById(recipe.userId);
    if (!author) throw new SomethingWentWrongError();
    return author;
  }
}
```

## Examples
This code samples are made up just for tutorial docs purposes.
You can find more advanced, real examples in [examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples).
