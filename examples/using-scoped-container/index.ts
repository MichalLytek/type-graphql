import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import Container, { ContainerInstance } from "typedi";
import { buildSchema, ResolverData } from "../../src";

import { RecipeResolver } from "./recipe/recipe.resolver";
import { Context } from "./types";
import { setSamplesInContainer } from "./recipe/recipe.samples";

async function bootstrap() {
  setSamplesInContainer();

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    // register our custom, scoped IOC container by passing a extracting from resolver data function
    container: ({ context }: ResolverData<Context>) => context.container,
  });

  // create GraphQL server
  const server = new ApolloServer({
    schema,
    // we need to provide unique context with `requestId` for each request
    context: (): Context => {
      const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // uuid-like
      const container = Container.of(requestId.toString()); // get scoped container
      const context = { requestId, container }; // create our context
      container.set("context", context); // place context or other data in container
      return context;
    },
    // create a plugin that will allow for disposing the scoped container created for every request
    plugins: [
      {
        requestDidStart: async () => ({
          async willSendResponse(requestContext) {
            // remember to dispose the scoped container to prevent memory leaks
            Container.reset(requestContext.context.requestId.toString());

            // for developers curiosity purpose, here is the logging of current scoped container instances
            // we can make multiple parallel requests to see in console how this works
            const instancesIds = ((Container as any).instances as ContainerInstance[]).map(
              instance => instance.id,
            );
            console.log("instances left in memory:", instancesIds);
          },
        }),
      },
    ],
  });

  // start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
