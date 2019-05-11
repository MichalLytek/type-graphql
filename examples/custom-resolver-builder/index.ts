import { buildSchema } from "../../src/utils";
import { RecipeResolver } from "./recipe-resolver";
import { GraphQLFieldResolver } from "graphql";
import { BaseResolverMetadata } from "../../src/metadata/definitions";
import { ApolloServer, AuthenticationError } from "apollo-server";
import "reflect-metadata";


async function bootstrap() {
  // simple custom resolver builder
  function resolverBuilder(metadata: BaseResolverMetadata): GraphQLFieldResolver<any, any, any> {
    return (root, args, { req }) => {
      const authMetadata = Reflect.getMetadata(
        "AUTHORIZATION",
        metadata.target,
        metadata.methodName,
      );

      if (authMetadata) {
        if (!req.headers.authorized || req.headers.authorized !== "true") {
          throw new AuthenticationError('Must set Authorized header to "true".');
        }
      }

      const targetInstance = new (metadata.target as any);
      return targetInstance[metadata.methodName].apply(targetInstance);
    };
  }

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    resolverBuilder,
  });

  // create and run apollo server
  const server = new ApolloServer({
    schema,
    playground: true,
    context: context => context,
  });
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
