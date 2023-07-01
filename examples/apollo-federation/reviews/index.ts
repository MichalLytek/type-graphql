import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Product } from "./product/product";
import { ProductReviewsResolver } from "./product/resolver";
import { ReviewsResolver } from "./review/resolver";
import { Review } from "./review/review";
import { UserReviewsResolver } from "./user/resolver";
import { User } from "./user/user";
import { buildFederatedSchema } from "../helpers/buildFederatedSchema";

export async function listen(port: number): Promise<string> {
  const schema = await buildFederatedSchema({
    resolvers: [ReviewsResolver, ProductReviewsResolver, UserReviewsResolver],
    orphanedTypes: [User, Review, Product],
  });

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Reviews service ready at ${url}`);

  return url;
}
