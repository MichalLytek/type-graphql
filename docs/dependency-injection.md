---
title: Dependency injection
---

Dependency injection is a really useful pattern that helps in decoupling parts of the app.

TypeGraphQL supports this technique by allowing users to provide their IoC container that will be used by the framework.

## Basic usage

The usage of this feature is very simple - all you need to do is to register 3rd party container. Example using TypeDI:

```typescript
import { buildSchema } from "type-graphql";
// import your IoC container
import { Container } from "typedi";

import { SampleResolver } from "./resolvers";

// build the schema as always
const schema = await buildSchema({
  resolvers: [SampleResolver],
  // register the 3rd party IOC container
  container: Container;
});
```

Then, your resolvers will be able to declare their dependencies and TypeGraphQL will use the container to solve them:

```typescript
import { Service } from "typedi";

@Service()
@Resolver(of => Recipe)
export class RecipeResolver {
  constructor(
    // constructor injection of a service
    private readonly recipeService: RecipeService,
  ) {}

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("recipeId") recipeId: string) {
    // usage of the injected service
    return this.recipeService.getOne(recipeId);
  }
}
```

And the sample recipe service implementation may look like this:

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

### Example

You can see how this fits together in the [simple example](https://github.com/19majkel94/type-graphql/tree/master/examples/using-container).

## Scoped containers

Dependency injection is a really powerful pattern. But some advanced users may encounter the need of creating fresh instances of some services or resolvers for every request. Since `v0.13.0`, **TypeGraphQL** supports this feature, that is extremely useful for tracking logs by individual requests or managing stateful services.

To register scoped container, you need to make some changes in the server bootstrapping config code.
At first you need to provide a container resolver function. It takes the resolver data (like context) as an argument and should return instance of the container scoped to the request.

For simple container libraries you may define it inline, e.g. using `TypeDI`:

```typescript
await buildSchema({
  container: (({ context }: ResolverData<TContext>) => Container.of(context.requestId));
};
```

The tricky part is where the `context.requestId` comes from. Unfortunately, you need to provide it manually using hooks that are exposed by HTTP GraphQL middlewares like `express-graphql`, `apollo-server` or `graphql-yoga`.

For some other advanced libraries, you might need to create an instance of the container, place it in the context object and then retrieve it in `container` getter function:

```typescript
await buildSchema({
  container: (({ context }: ResolverData<TContext>) => context.container);
};
```

Example using `TypeDI` and `apollo-server` with the `context` creation method:

```typescript
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";

const server = new ApolloServer({
  // schema comes from `buildSchema` as always
  schema,
  // provide unique context with `requestId` for each request
  context: () => {
    // generate the requestId (it also may come from `express-request-id` or other middleware)
    const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // uuid-like
    const container = Container.of(requestId); // get the scoped container
    const context = { requestId, container }; // create fresh context object
    container.set("context", context); // place context or other data in container
    return context;
  },
});
```

You also have to dispose the container after the request has been handled and the response is ready. Otherwise, there would be a huge memory leak as the new instances of services and resolvers have been created for each request but they haven't been cleaned up.

Unfortunately, Apollo Server doesn't have the "document middlewares" feature yet, so some dirty tricks are needed to do the cleanup.
Example using `TypeDI` and `apollo-server` with the `formatResponse` method:

```typescript
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";

const server = new ApolloServer({
  // ... schema and context here
  formatResponse: (response: any, { context }: ResolverData<Context>) => {
    // remember to dispose the scoped container to prevent memory leaks
    Container.reset(context.requestId);
    return response;
  },
});
```

And basically that's it! The configuration of container is done and TypeGraphQL will be able to use different instances of resolvers for each request.

The only thing that left is the container configuration - you need to check out the docs for your container library (`InversifyJS`, `injection-js`, `TypeDI` or other) to get know how to setup a lifetime of the injectable objects (transient, scoped or singleton).

> Be aware that some libraries (like `TypeDI`) by default creates new instances for every scoped container, so you might experience a **significant grow of a memory usage** and a some decrease in query resolving speed, so please be careful with using this feature!

### Example

For more advanced usage example with scoped containers, check out [advanced example with scoped containers](https://github.com/19majkel94/type-graphql/tree/master/examples/using-scoped-container).
