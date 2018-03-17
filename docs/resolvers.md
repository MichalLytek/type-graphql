# Resolvers
Besides [declaring GraphQL's object types](./types-and-fields.md), TypeGraphQL allows to create queries, mutations and field resolvers in an easy way - like a normal class methods, similar to REST controllers in frameworks like Java's `Spring`, .NET `Web API` or TypeScript's [routing-controllers](https://github.com/typestack/routing-controllers).

## Queries and mutations

At first, you have to create a resolver class and annotate it with `@Resolver()` decorator. This class will behave like a controller known from classic REST frameworks:
```ts
@Resolver()
class RecipeResolver {

}
```

You can use DI framework (as described in [dependency injection docs](./dependency-injection.md)) to inject class dependencies (like services or repositories) or store data inside resolvers class - it's guarranted to be a single instance per app.
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
The second is to provide the return type - the method is async so reflection metadata system shows that the return type is `Promise` of sth, so we have to add `returnType => [Recipe]` decorator's parameter to declare that it will be an array of `Recipe` object types.
```ts
@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];

  @Query(returnType => [Recipe])
  async recipes() {
    return await this.recipesCollection;
  }
}
```

Usually queries have some arguments - it might be an id of the resource, the search phrase or pagination settings. TypeGraphQL allows you to define the arguments in two ways.

First is the inline method using `@Arg()` decorator. The drawback is the need of repeating argument name (reflection system limitation) in decorator parameter.
```ts
@Resolver()
class RecipeResolver {
  // ...
  @Query(returnType => [Recipe])
  async recipes(
    @Arg("title" { nullable: true }) title?: string,
  ): Promise<Recipe[]> {
    // ...
  }
}
```
It's quite good when there are up to 2-3 args but when you have many more, the resolver's method definitions becomes bloated. In that case you can use the args class definition:
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
Here you can define default values (remember about `nullable: true`!) as well as helper methods.
Also, this way allows you to perform validation of the arguments/inputs - more details about this feature you can find in [validation docs](./validation.md).

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
We can use the destruction syntax to have access to single arguments as variables, instead of the reference to the whole args object:
```ts
@Resolver()
class RecipeResolver {
  // ...
  @Query(returnType => [Recipe])
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

This declarations will result in the folowing part of the schema in SDL:
```grapqhl
type Query {
  recipes(skip: Int, take: Int, title: String): [Recipe!]
}
```

GraphQL's mutations we can create analogously, by declaring the class method, using `@Mutation` decorator, providing return type (if needed), creating arguments, etc. But for mutation we ussualy use `input` types, hence why TypeGraphQL allows you to create inputs in the same way as the [object types](./types-and-fields.md) but using `@InputType()` decorator:
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
Because our method is synchronous and explicitly returns `Recipe`, we can ommit `@Mutation()` type annotation.

This declarations will result in the folowing part of the schema in SDL:
```grapqhl
input AddRecipeInput {
  title: String!
  description: String
}

type Mutation {
  addRecipe(data: AddRecipeInput!): Recipe!
}
```

By using parameter decorators, we can get rid of the unnecessary parameters like root value that bloat our method definition and have to be ignored with `_` parameter name. Also, we can achive clean separation between GraphQL and our bussiness code with decorators abstraction, so our resolvers and their methods behave just like services which we can easy unit-test.
