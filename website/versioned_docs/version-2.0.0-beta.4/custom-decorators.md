---
title: Custom decorators
id: version-2.0.0-beta.4-custom-decorators
original_id: custom-decorators
---

Custom decorators are a great way to reduce the boilerplate and reuse some common logic between different resolvers. TypeGraphQL supports two kinds of custom decorators - method and parameter.

## Method decorators

Using [middlewares](./middlewares.md) allows to reuse some code between resolvers. To further reduce the boilerplate and have a nicer API, we can create our own custom method decorators.

They work in the same way as the [reusable middleware function](./middlewares.md#reusable-middleware), however, in this case we need to call `createMethodDecorator` helper function with our middleware logic and return its value:

```ts
export function ValidateArgs(schema: JoiSchema) {
  return createMethodDecorator(async ({ args }, next) => {
    // Middleware code that uses custom decorator arguments

    // e.g. Validation logic based on schema using 'joi'
    await joiValidate(schema, args);
    return next();
  });
}
```

The usage is then very simple, as we have a custom, descriptive decorator - we just place it above the resolver/field and pass the required arguments to it:

```ts
@Resolver()
export class RecipeResolver {
  @ValidateArgs(MyArgsSchema) // Custom decorator
  @UseMiddleware(ResolveTime) // Explicit middleware
  @Query()
  randomValue(@Args() { scale }: MyArgs): number {
    return Math.random() * scale;
  }
}
```

## Parameter decorators

Parameter decorators are just like the custom method decorators or middlewares but with an ability to return some value that will be injected to the method as a parameter. Thanks to this, it reduces the pollution in `context` which was used as a workaround for the communication between reusable middlewares and resolvers.

They might be just a simple data extractor function, that makes our resolver more unit test friendly:

```ts
function CurrentUser() {
  return createParamDecorator<MyContextType>(({ context }) => context.currentUser);
}
```

Or might be a more advanced one that performs some calculations and encapsulates some logic. Compared to middlewares, they allows for a more granular control on executing the code, like calculating fields map based on GraphQL info only when it's really needed (requested by using the `@Fields()` decorator):

```ts
function Fields(level = 1): ParameterDecorator {
  return createParamDecorator(async ({ info }) => {
    const fieldsMap: FieldsMap = {};
    // Calculate an object with info about requested fields
    // based on GraphQL 'info' parameter of the resolver and the level parameter
    // or even call some async service, as it can be a regular async function and we can just 'await'
    return fieldsMap;
  });
}
```

> Be aware, that `async` function as a custom param decorators logic can make the GraphQL resolver execution slower, so try to avoid them, if possible.

Then we can use our custom param decorators in the resolvers just like the built-in decorators:

```ts
@Resolver()
export class RecipeResolver {
  constructor(private readonly recipesRepository: Repository<Recipe>) {}

  @Authorized()
  @Mutation(returns => Recipe)
  async addRecipe(
    @Args() recipeData: AddRecipeInput,
    // Custom decorator just like the built-in one
    @CurrentUser() currentUser: User,
  ) {
    const recipe: Recipe = {
      ...recipeData,
      // and use the data returned from custom decorator in the resolver code
      author: currentUser,
    };
    await this.recipesRepository.save(recipe);

    return recipe;
  }

  @Query(returns => Recipe, { nullable: true })
  async recipe(
    @Arg("id") id: string,
    // Custom decorator that parses the fields from GraphQL query info
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

See how different kinds of custom decorators work in the [custom decorators and middlewares example](https://github.com/MichalLytek/type-graphql/tree/v2.0.0-beta.4/examples/middlewares-custom-decorators).
