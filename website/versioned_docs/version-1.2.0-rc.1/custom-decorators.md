---
title: Custom decorators
id: version-1.2.0-rc.1-custom-decorators
original_id: custom-decorators
---

Custom decorators are a great way to reduce the boilerplate and reuse some common logic between different resolvers. TypeGraphQL supports two kinds of custom decorators - method and parameter.

## Method decorators

Using [middlewares](middlewares.md) allows to reuse some code between resolvers. To further reduce the boilerplate and have a nicer API, we can create our own custom method decorators.

They work in the same way as the [reusable middleware function](middlewares.md#reusable-middleware), however, in this case we need to call `createMethodDecorator` helper function with our middleware logic and return its value:

```typescript
export function ValidateArgs(schema: JoiSchema) {
  return createMethodDecorator(async ({ args }, next) => {
    // here place your middleware code that uses custom decorator arguments

    // e.g. validation logic based on schema using joi
    await joiValidate(schema, args);
    return next();
  });
}
```

The usage is then very simple, as we have a custom, descriptive decorator - we just place it above the resolver/field and pass the required arguments to it:

```typescript
@Resolver()
export class RecipeResolver {
  @ValidateArgs(MyArgsSchema) // custom decorator
  @UseMiddleware(ResolveTime) // explicit middleware
  @Query()
  randomValue(@Args() { scale }: MyArgs): number {
    return Math.random() * scale;
  }
}
```

## Parameter decorators

Parameter decorators are just like the custom method decorators or middlewares but with an ability to return some value that will be injected to the method as a parameter. Thanks to this, it reduces the pollution in `context` which was used as a workaround for the communication between reusable middlewares and resolvers.

They might be just a simple data extractor function, that makes our resolver more unit test friendly:

```typescript
function CurrentUser() {
  return createParamDecorator<MyContextType>(({ context }) => context.currentUser);
}
```

Or might be a more advanced one that performs some calculations and encapsulates some logic. Compared to middlewares, they allows for a more granular control on executing the code, like calculating fields map based on GraphQL info only when it's really needed (requested by using the `@Fields()` decorator):

```typescript
function Fields(level = 1): ParameterDecorator {
  return createParamDecorator(({ info }) => {
    const fieldsMap: FieldsMap = {};
    // calculate an object with info about requested fields
    // based on GraphQL `info` parameter of the resolver and the level parameter
    return fieldsMap;
  });
}
```

Then we can use our custom param decorators in the resolvers just like the built-in decorators:

```typescript
@Resolver()
export class RecipeResolver {
  constructor(private readonly recipesRepository: Repository<Recipe>) {}

  @Authorized()
  @Mutation(returns => Recipe)
  async addRecipe(
    @Args() recipeData: AddRecipeInput,
    // here we place our custom decorator
    // just like the built-in one
    @CurrentUser() currentUser: User,
  ) {
    const recipe: Recipe = {
      ...recipeData,
      // and use the data returned from custom decorator in our resolver code
      author: currentUser,
    };
    await this.recipesRepository.save(recipe);
    return recipe;
  }

  @Query(returns => Recipe, { nullable: true })
  async recipe(
    @Arg("id") id: string,
    // our custom decorator that parses the fields from graphql query info
    @Fields() fields: FieldsMap,
  ) {
    return await this.recipesRepository.find(id, {
      // use the fields map as a select projection to optimize db queries
      select: fields,
    });
  }
}
```

## Example

See how different kinds of custom decorators work in the [custom decorators and middlewares example](https://github.com/MichalLytek/type-graphql/tree/master/examples/middlewares-custom-decorators).
