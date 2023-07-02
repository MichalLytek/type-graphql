import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Product, ProductReviewsResolver } from "./product";
import { Review, ReviewsResolver } from "./review";
import { User, UserReviewsResolver } from "./user";
import { buildFederatedSchema } from "../helpers";

export async function listen(port: number): Promise<string> {
  // Build TypeGraphQL executable schema
  const schema = await buildFederatedSchema({
    resolvers: [ReviewsResolver, ProductReviewsResolver, UserReviewsResolver],
    orphanedTypes: [User, Review, Product],
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Reviews service ready at ${url}`);

  return url;
}
