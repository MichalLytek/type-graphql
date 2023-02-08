import { ApolloServer } from "apollo-server";

import ReviewsResolver from "./review/resolver";
import ProductReviewsResolver from "./product/resolver";
import UserReviewsResolver from "./user/resolver";
import Review from "./review/review";
import User from "./user/user";
import Product from "./product/product";
import { buildFederatedSchema } from "../helpers/buildFederatedSchema";

export async function listen(port: number): Promise<string> {
  const schema = await buildFederatedSchema({
    resolvers: [ReviewsResolver, ProductReviewsResolver, UserReviewsResolver],
    orphanedTypes: [User, Review, Product],
  });

  const server = new ApolloServer({ schema });

  const { url } = await server.listen({ port });
  console.log(`Reviews service ready at ${url}`);

  return url;
}
