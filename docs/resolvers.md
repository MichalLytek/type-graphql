---
title: Resolvers
---

Besides [declaring GraphQL's object types](./types-and-fields.md), TypeGraphQL allows to create queries, mutations and field resolvers in an easy way - like a normal class methods, similar to REST controllers in frameworks like Java's `Spring`, .NET `Web API` or TypeScript's [routing-controllers](https://github.com/typestack/routing-controllers).

## Queries and mutations

### Resolvers classes
First you have to create a resolver class and annotate it with `@Resolver()` decorator. This class will behave like a controller from classic REST frameworks:
```typescript
@Resolver()
class RecipeResolver {

}
```

You can use a DI framework (as described in [dependency injection docs](./dependency-injection.md)) to inject class dependencies (like services or repositories) or store data inside resolvers class - it's guaranteed to be a single instance per app.
```typescript
@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];
}
```

Then you can create class methods which will handle queries and mutations. For example let's add the `recipes` query to return a collection of all recipes:
```typescript
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
The first is to add the `@Query` decorator, which marks the class method as a GraphQL query.
The second is to provide the return type.  Since the method is async, the reflection metadata system shows the return type as `Promise`, so we have to add the decorator's parameter as `returns => [Recipe]` to declare it resolve to an array of `Recipe` object types.
```typescript
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

First is the inline method using `@Arg()` decorator. The drawback is the need of repeating argument name (due to a reflection system limitation) in the decorator parameter.
```typescript
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
This works well when there are 2 - 3 args.  But when you have many more, the resolver's method definitions becomes bloated. In that case you can use a class definition to describe the arguments. It looks like the object type class but it has `@ArgsType()` decorator on top.
```typescript
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
Also, this way of declaring arguments allows you to perform validation.  You can find more details about this feature in [the validation docs](./validation.md).

```typescript
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
We can use the destructuring syntax to have access to single arguments as variables, instead of the reference to the whole args object.
```typescript
@Resolver()
class RecipeResolver {
  // ...
  @Query(returns => [Recipe])
  async recipes(@Args() { title, startIndex, endIndex }: GetRecipesArgs) {
    // sample implementation
    let recipes = this.recipesCollection;
    if (title) {
      recipes = recipes.filter(recipe => recipe.title === title)
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
GraphQL's mutations we can create analogously, by declaring the class method, using `@Mutation` decorator, providing return type (if needed), creating arguments, etc. But for mutation we usually use `input` types, hence TypeGraphQL allows you to create inputs in the same way as the [object types](./types-and-fields.md) but using `@InputType()` decorator:
```typescript
@InputType()
class AddRecipeInput {

}
```

We can also leverage TypeScript type checking system and ensure that we won't accidentally change the type of property by implementing `Partial` type:
```typescript
@InputType()
class AddRecipeInput implements Partial<Recipe> {
  
}
```

Then we can declare all the input fields we would need, using `@Field()` decorator:
```typescript
@InputType({ description: "New recipe data" })
class AddRecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
```

After that we can use the `AddRecipeInput` type in our mutation. We can do this inline (using `@Arg()` decorator) or as a field of the args class like in query's example above.

We might also need access to the context. To achieve this we use the `@Ctx()` decorator with the optional user-defined `Context` interface:
```typescript
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
Because our method is synchronous and explicitly returns `Recipe`, we can omit the `@Mutation()` type annotation.

This declaration will result in the following part of the schema in SDL:
```graphql
input AddRecipeInput {
  title: String!
  description: String
}
```
```graphql
type Mutation {
  addRecipe(data: AddRecipeInput!): Recipe!
}
```

By using parameter decorators, we can get rid of the unnecessary parameters (like `root`) that bloat our method definition and have to be ignored by prefixing the parameter name with `_`. Also, we can achieve a clean separation between GraphQL and our business code with decorators, so our resolvers and their methods behave just like services which we can easily unit-test.

## Field resolvers
Queries and mutations are not the only type of resolvers. We often create object type field resolvers (e.g. when a `user` type has a field `posts`) which we have to resolve by fetching relational data from the database.

Field resolvers in TypeGraphQL are very similar to queries and mutations - we create them as a method on the resolver class but with a few modifications. Firstly, we need to declare which object type's fields we are resolving by providing the type to the `@Resolver` decorator:
```typescript
@Resolver(of => Recipe)
class RecipeResolver {
  // queries and mutations
}
```

Then we can create the class method that become the field resolver.
In our example we have the `averageRating` field in the `Recipe` object type that should calculate the average from the `ratings` array.
```typescript
@Resolver(of => Recipe)
class RecipeResolver {
  // queries and mutations

  averageRating(recipe: Recipe) {
    // ...
  }
}
```

We need to mark the method as a field resolver with the `@FieldResolver()` decorator. Because we've defined the type of the field in the `Recipe` class definition, there's no need to do this again. We also need to decorate the method's parameters with `@Root` to inject the recipe object.
```typescript
@Resolver(of => Recipe)
class RecipeResolver {
  // queries and mutations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    // ...
  }
}
```

For enhanced type safety you can implement the `ResolverInterface<Recipe>` interface.
It's a small helper that will check if the return type of field resolver methods, like `averageRating(...)`, match the `averageRating` property of the `Recipe` class
and whether the first parameter of the method is the object type (`Recipe` class).
```typescript
@Resolver(of => Recipe)
class RecipeResolver implements ResolverInterface<Recipe> {
  // queries and mutations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    // ...
  }
}
```

Here is a full sample implementation of the `averageRating` field resolver:
```typescript
@Resolver(of => Recipe)
class RecipeResolver implements ResolverInterface<Recipe> {
  // queries and mutations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    const ratingsSum = recipe.ratings.reduce((a, b) => a + b, 0);
    return recipe.ratings.length
      ? ratingsSum / recipe.ratings.length
      : null;
  }
}
```

For simple resolvers like `averageRating` or deprecated fields that behave like aliases, you can create the field resolvers inline in object type's class definition:

```typescript
@ObjectType()
class Recipe {
  @Field()
  title: string;

  @Field({ deprecationReason: "Use `title` instead" })
  get name(): string { 
    return this.title;
  }

  @Field(type => [Rate])
  ratings: Rate[];

  @Field(type => Float, { nullable: true })
  averageRating(@Arg("since") sinceDate: Date): number | null {
    const ratings = this.ratings.filter(rate => rate.date > sinceDate);
    if (!ratings.length) return null;

    const ratingsSum = ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratings.length;
  };
}
```

However, if the code is more complicated and has side effects (i.e. api calls, fetching from databases), use a resolver class's method instead.  That way you can leverage the dependency injection mechanism, which is really helpful in testing.  For example:

```typescript
@Resolver(of => Recipe)
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

Note that if a field name of a field resolver doesn't exit in resolver object type, it will create in schema a field with this name. This feature is useful when the field is purely calculable (eg. `averageRating` from `ratings` array) and you don't want to pollute the class signature.

## Resolvers inheritance
Inheritance of resolver classes is an advanced topic covered in [interfaces and inheritance docs](./interfaces-and-inheritance.md#resolvers-inheritance).

## Examples
These code samples are made up just for tutorial purposes.
You can find more advanced, real examples in the repository [examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples).
