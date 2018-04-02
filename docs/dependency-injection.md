---
title: Dependency injection
---

Dependency injection is a really useful pattern that helps in decoupling parts of the app.

TypeGraphQL supports this technique by allowing users to provide the IoC container that will be used by the framework.

## How to use
The usage is very simple - all you need to do is to register 3rd party container. Example using TypeDI:
```ts
import { useContainer, buildSchema } from "type-graphql";
// import your IoC container
import { Container } from "typedi";

import { SampleResolver } from "./resolvers";

// register the 3rd party IOC container
useContainer(Container);

// build the schema as always
const schema = await buildSchema({
  resolvers: [SampleResolver],
});
```

Then, your resolvers will be able to declare their dependecies and TypeGraphQL will use the container to solve them:

```ts
import { Service } from "typedi";

@Service()
@Resolver(objectType => Recipe)
export class RecipeResolver {
  constructor(
    // constructor injection of a service
    private readonly recipeService: RecipeService,
  ) {}

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("recipeId") recipeId: string) {
    return this.recipeService.getOne(recipeId);
  }
}
```

Sample service implementation looks like this:

```typescript
import { Service, Inject } from "typedi";

@Service()
export class RecipeService {
  @Inject("SAMPLE_RECIPES")
  private readonly items: Recipe[],

  async getAll() {
    return this.items;
  }

  async getOne(id: string) {
    return this.items.find(item => item.id === id);
  }
}
```

## Example
You can see how this fits together in the [simple example](https://github.com/19majkel94/type-graphql/tree/master/examples/using-container).
 