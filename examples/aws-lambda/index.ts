import "reflect-metadata";
import { buildSchema } from "../../src";
import { RecipeResolver } from "./recipe-resolver";
import { GraphQLSchema } from "graphql";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ApolloServer } from "apollo-server-lambda";

let cachedSchema: GraphQLSchema | null = null;
let cachedServer: ApolloServer | null = null;

export const handler: APIGatewayProxyHandlerV2 = async (event, context, callback) => {
  // build TypeGraphQL executable schema
  cachedSchema ??= await buildSchema({
    resolvers: [RecipeResolver],
  });

  // Create GraphQL server
  cachedServer ??= new ApolloServer({ schema: cachedSchema });

  return cachedServer.createHandler({})(event, context, callback);
};
