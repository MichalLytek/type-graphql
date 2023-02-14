import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Container, ContainerInstance } from "typedi";
import { buildSchema, ResolverData } from "type-graphql";
import { RecipeResolver } from "./recipe/recipe.resolver";
import { setSamplesInContainer } from "./recipe/recipe.samples";
import { Context } from "./types";

async function bootstrap() {
  setSamplesInContainer();

  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    // Registry custom, scoped IOC container from resolver data function
    container: ({ context }: ResolverData<Context>) => context.container,
  });

  // Create GraphQL server
  const server = new ApolloServer<Context>({
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
}

bootstrap();
