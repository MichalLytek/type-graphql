# Resolvers

## Definition
<dl>
  <dt>GraphQLResolver</dt>
  <dd>Marks our class as a resolver of `Type` you need to (type info is needed for attaching field resolver to correct type).</dd>
  
  <dt>Mutation</dt>
  <dd>@Mutation() with return type function syntax</dd>

  <dt>Query</dt>
  <dd>Decorator marks the class method as the query</dd>
  <dd>Our method is async, so we can't infer the return type from reflection system - we need to define it as (returnType => `Type`)</dd>
</dl>

## How-To use resolvers
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

