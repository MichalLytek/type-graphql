---
title: Resolvers
id: version-1.2.0-rc.1-resolvers
original_id: resolvers
---

Besides [declaring GraphQL's object types](types-and-fields.md), TypeGraphQL allows us to easily create queries, mutations and field resolvers - like normal class methods, similar to REST controllers in frameworks like Java `Spring`, .NET `Web API` or TypeScript [`routing-controllers`](https://github.com/typestack/routing-controllers).

## Queries and Mutations

### Resolver classes

First we create the resolver class and annotate it with the `@Resolver()` decorator. This class will behave like a controller from classic REST frameworks:

```typescript
@Resolver()
class RecipeResolver {}
```

We can use a DI framework (as described in the [dependency injection docs](dependency-injection.md)) to inject class dependencies (like services or repositories) or to store data inside the resolver class - it's guaranteed to be a single instance per app.

```typescript
@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];
}
```

Then we can create class methods which will handle queries and mutations. For example, let's add the `recipes` query to return a collection of all recipes:

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
The second is to provide the return type. Since the method is async, the reflection metadata system shows the return type as a `Promise`, so we have to add the decorator's parameter as `returns => [Recipe]` to declare it resolves to an array of `Recipe` object types.

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

Usually, queries have some arguments - it might be the id of a resource, a search phrase or pagination settings. TypeGraphQL allows you to define arguments in two ways.

First is the inline method using the `@Arg()` decorator. The drawback is the need to repeating the argument name (due to a limitation of the reflection system) in the decorator parameter. As we can see below, we can also pass a `defaultValue` option that will be reflected in the GraphQL schema.

```typescript
@Resolver()
class RecipeResolver {
  // ...
  @Query(returns => [Recipe])
  async recipes(
    @Arg("servings", { defaultValue: 2 }) servings: number,
    @Arg("title", { nullable: true }) title?: string,
  ): Promise<Recipe[]> {
    // ...
  }
}
```

This works well when there are 2 - 3 args. But when you have many more, the resolver's method definitions become bloated. In this case we can use a class definition to describe the arguments. It looks like the object type class but it has the `@ArgsType()` decorator on top.

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

We can define default values for optional fields in the `@Field()` decorator using the `defaultValue` option or by using a property initializer - in both cases TypeGraphQL will reflect this in the schema by setting the default value, so users will be able to omit those args while sending a query.

> Be aware that `defaultValue` works only for input args and fields, like `@Arg`, `@ArgsType` and `@InputType`.
> Setting `defaultValue` does not affect `@ObjectType` or `@InterfaceType` fields as they are for output purposes only.

Also, this way of declaring arguments allows you to perform validation. You can find more details about this feature in the [validation docs](validation.md).

We can also define helper fields and methods for our args or input classes. But be aware that **defining constructors is strictly forbidden** and we shouldn't use them there, as TypeGraphQL creates instances of args and input classes under the hood by itself.

```typescript
import { Min, Max } from "class-validator";

@ArgsType()
class GetRecipesArgs {
  @Field(type => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field({ nullable: true })
  title?: string;

  // helpers - index calculations
  get startIndex(): number {
    return this.skip;
  }
  get endIndex(): number {
    return this.skip + this.take;
  }
}
```

Then all that is left to do is use the args class as the type of the method parameter.
We can use the destructuring syntax to gain access to single arguments as variables, instead of the reference to the whole args object.

```typescript
@Resolver()
class RecipeResolver {
  // ...
  @Query(returns => [Recipe])
  async recipes(@Args() { title, startIndex, endIndex }: GetRecipesArgs) {
    // sample implementation
    let recipes = this.recipesCollection;
    if (title) {
      recipes = recipes.filter(recipe => recipe.title === title);
    }
    return recipes.slice(startIndex, endIndex);
  }
}
```

This declaration will result in the following part of the schema in SDL:

```graphql
type Query {
  recipes(skip: Int = 0, take: Int = 25, title: String): [Recipe!]
}
```

### Input types

GraphQL mutations can be similarly created: Declare the class method, use the `@Mutation` decorator, create arguments, provide a return type (if needed) etc. But for mutations we usually use `input` types, hence TypeGraphQL allows us to create inputs in the same way as [object types](types-and-fields.md) but by using the `@InputType()` decorator:

```typescript
@InputType()
class AddRecipeInput {}
```

To ensure we don't accidentally change the property type we leverage the TypeScript type checking system by implementing the `Partial` type:

```typescript
@InputType()
class AddRecipeInput implements Partial<Recipe> {}
```

We then declare any input fields we need, using the `@Field()` decorator:

```typescript
@InputType({ description: "New recipe data" })
class AddRecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
```

After that we can use the `AddRecipeInput` type in our mutation. We can do this inline (using the `@Arg()` decorator) or as a field of the args class like in the query example above.

We may also need access to the context. To achieve this we use the `@Ctx()` decorator with the optional user-defined `Context` interface:

```typescript
@Resolver()
class RecipeResolver {
  // ...
  @Mutation()
  addRecipe(@Arg("data") newRecipeData: AddRecipeInput, @Ctx() ctx: Context): Recipe {
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

By using parameter decorators, we can get rid of unnecessary parameters (like `root`) that bloat our method definition and have to be ignored by prefixing the parameter name with `_`. Also, we can achieve a clean separation between GraphQL and our business code by using decorators, so our resolvers and their methods behave just like services which can be easily unit-tested.

## Field resolvers

Queries and mutations are not the only type of resolvers. We often create object type field resolvers (e.g. when a `user` type has a `posts` field) which we have to resolve by fetching relational data from the database.

Field resolvers in TypeGraphQL are very similar to queries and mutations - we create them as a method on the resolver class but with a few modifications. First we declare which object type fields we are resolving by providing the type to the `@Resolver` decorator:

```typescript
@Resolver(of => Recipe)
class RecipeResolver {
  // queries and mutations
}
```

Then we create a class method that will become the field resolver.
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

We then mark the method as a field resolver with the `@FieldResolver()` decorator. Since we've already defined the field type in the `Recipe` class definition, there's no need to redefine it. We also decorate the method parameters with the `@Root` decorator in order to inject the recipe object.

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

For enhanced type safety we can implement the `ResolverInterface<Recipe>` interface.
It's a small helper that checks if the return type of the field resolver methods, like `averageRating(...)`, matches the `averageRating` property of the `Recipe` class and whether the first parameter of the method is the actual object type (`Recipe` class).

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

Here is the full implementation of the sample `averageRating` field resolver:

```typescript
@Resolver(of => Recipe)
class RecipeResolver implements ResolverInterface<Recipe> {
  // queries and mutations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    const ratingsSum = recipe.ratings.reduce((a, b) => a + b, 0);
    return recipe.ratings.length ? ratingsSum / recipe.ratings.length : null;
  }
}
```

For simple resolvers like `averageRating` or deprecated fields that behave like aliases, you can create field resolvers inline in the object type class definition:

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
  }
}
```

However, if the code is more complicated and has side effects (i.e. api calls, fetching data from a databases), a resolver class method should be used instead. This way we can leverage the dependency injection mechanism, which is really helpful in testing. For example:

```typescript
import { Repository } from "typeorm";

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

Note that if a field name of a field resolver doesn't exist in the resolver object type, it will create a field in the schema with this name. This feature is useful when the field is purely calculable (eg. `averageRating` from `ratings` array) and to avoid polluting the class signature.

## Resolver Inheritance

Resolver class `inheritance` is an advanced topic covered in the [resolver inheritance docs](inheritance.md#resolvers-inheritance).

## Examples

These code samples are just made up for tutorial purposes.
You can find more advanced, real examples in the [examples folder on the repository](https://github.com/MichalLytek/type-graphql/tree/master/examples).
