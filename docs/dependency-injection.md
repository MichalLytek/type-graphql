---
title: Dependency injection
---

Dependency injection is a really useful pattern that helps in decoupling parts of the app.

TypeGraphQL supports this technique by allowing users to provide their IoC container that will be used by the framework.

## Basic usage

The usage of this feature is very simple - all you need to do is register a 3rd party container.

Example using TypeDI:

```ts
import { buildSchema } from "type-graphql";
// IOC container
import { Container } from "typedi";
import { SampleResolver } from "./resolvers";

// Build TypeGraphQL executable schema
const schema = await buildSchema({
  // Array of resolvers
  resolvers: [SampleResolver],
  // Registry 3rd party IOC container
  container: Container,
});
```

Resolvers will then be able to declare their dependencies and TypeGraphQL will use the container to solve them:

```ts
import { Service } from "typedi";

@Service()
@Resolver(of => Recipe)
export class RecipeResolver {
  constructor(
    // Dependency injection
    private readonly recipeService: RecipeService,
  ) {}

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("recipeId") recipeId: string) {
    // Usage of the injected service
    return this.recipeService.getOne(recipeId);
  }
}
```

A sample recipe service implementation may look like this:

```ts
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

> Be aware than when you use [InversifyJS](https://github.com/inversify/InversifyJS), you have to bind the resolver class with the [self-binding of concrete types](https://github.com/inversify/InversifyJS/blob/master/wiki/classes_as_id.md#self-binding-of-concrete-types), e.g.:
>
> ```ts
> container.bind<SampleResolver>(SampleResolver).to(SampleResolver).inSingletonScope();
> ```

## Scoped containers

Dependency injection is a really powerful pattern, but some advanced users may encounter the need for creating fresh instances of some services or resolvers for every request. Since `v0.13.0`, **TypeGraphQL** supports this feature, that is extremely useful for tracking logs by individual requests or managing stateful services.

To register a scoped container, we need to make some changes in the server bootstrapping config code.
First we need to provide a container resolver function. It takes the resolver data (like context) as an argument and should return an instance of the container scoped to the request.

For simple container libraries we may define it inline, e.g. using `TypeDI`:

```ts
await buildSchema({
  container: (({ context }: ResolverData<TContext>) => Container.of(context.requestId));
};
```

The tricky part is where the `context.requestId` comes from. Unfortunately, we need to provide it manually using hooks that are exposed by HTTP GraphQL middleware like `express-graphql`, `@apollo/server` or `graphql-yoga`.

For some other advanced libraries, we might need to create an instance of the container, place it in the context object and then retrieve it in the `container` getter function:

```ts
await buildSchema({
  container: (({ context }: ResolverData<TContext>) => context.container);
};
```

Example using `TypeDI` and `@apollo/server` with the `context` creation method:

```ts
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Container } from "typedi";

// Create GraphQL server
const server = new ApolloServer({
  // GraphQL schema
  schema,
});

// Start server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  // Provide unique context with 'requestId' for each request
  context: async () => {
    const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // uuid-like
    const container = Container.of(requestId.toString()); // Get scoped container
    const context = { requestId, container }; // Create context
    container.set("context", context); // Set context or other data in container

    return context;
  },
});
console.log(`GraphQL server ready at ${url}`);
```

We also have to dispose the container after the request has been handled and the response is ready. Otherwise, there would be a huge memory leak as the new instances of services and resolvers have been created for each request but they haven't been cleaned up.

Apollo Server has a [plugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins) feature that supports [`willSendResponse`](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#willsendresponse) lifecycle event. We can leverage it to clean up the container after handling the request.

Example using `TypeDI` and `@apollo/server` with plugins approach:

```ts
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Container } from "typedi";

const server = new ApolloServer({
  // GraphQL schema
  schema,
  // Create a plugin to allow for disposing the scoped container created for every request
  plugins: [
    {
      requestDidStart: async () => ({
        async willSendResponse(requestContext) {
          // Dispose the scoped container to prevent memory leaks
          Container.reset(requestContext.contextValue.requestId.toString());

          // For developers curiosity purpose, here is the logging of current scoped container instances
          // Make multiple parallel requests to see in console how this works
          const instancesIds = ((Container as any).instances as ContainerInstance[]).map(
            instance => instance.id,
          );
          console.log("Instances left in memory: ", instancesIds);
        },
      }),
    },
  ],
});
```

And basically that's it! The configuration of the container is done and TypeGraphQL will be able to use different instances of resolvers for each request.

The only thing that's left is the container configuration - we need to check out the docs for our container library (`InversifyJS`, `injection-js`, `TypeDI` or other) to get know how to setup the lifetime of the injectable objects (transient, scoped or singleton).

> Be aware that some libraries (like `TypeDI`) by default create new instances for every scoped container, so you might experience a **significant increase in memory usage** and some slowing down in query resolving speed, so please be careful with using this feature!

## Example

You can see how this fits together in the [simple example](../examples/using-container).

For a more advanced usage example with scoped containers, check out [advanced example with scoped containers](../examples/using-scoped-container).
