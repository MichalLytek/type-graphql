import federationDirectives from "@apollo/federation/dist/directives";
import { buildFederatedSchema } from "@apollo/federation";
import { specifiedDirectives } from "graphql";
import { ApolloServer } from "apollo-server";
import {
  ObjectType,
  Field,
  Resolver,
  buildSchema,
  ID,
  FieldResolver,
  Root,
  Directive,
} from "../../../src";
import { getMetadataStorage } from "../../../src/metadata/getMetadataStorage";
import { Type } from "class-transformer";

const buildTypeSchema = async () => {
  getMetadataStorage().clear();

  @ObjectType()
  @Directive("extends")
  @Directive("key", { fields: "id" })
  class User {
    @Field(() => ID)
    @Directive("external")
    id: string;

    @Field(() => String)
    @Directive("external")
    username: string;
  }

  @ObjectType()
  @Directive("extends")
  @Directive("key", { fields: "upc" })
  class Product {
    @Field()
    @Directive("external")
    upc: string;
  }

  @ObjectType()
  @Directive("key", { fields: "id" })
  class Review {
    @Field(() => ID)
    id: string;

    @Field()
    body: string;

    @Type(() => User)
    @Field(() => User)
    @Directive("provides", { fields: "username" })
    author: User;

    @Type(() => Product)
    @Field(() => Product)
    product: Product;
  }

  const reviews: Review[] = [
    {
      id: "1",
      author: { id: "1", username: "@ada" },
      product: { upc: "1" },
      body: "Love it!",
    },
    {
      id: "2",
      author: { id: "1", username: "@ada" },
      product: { upc: "2" },
      body: "Too expensive.",
    },
    {
      id: "3",
      author: { id: "2", username: "@complete" },
      product: { upc: "3" },
      body: "Could be better.",
    },
    {
      id: "4",
      author: { id: "2", username: "@complete" },
      product: { upc: "1" },
      body: "Prefer something else.",
    },
  ];

  @Resolver(() => Review)
  class ReviewsResolver {
    @FieldResolver(() => [Review])
    async reviews(): Promise<Review[]> {
      return reviews;
    }
  }

  @Resolver(() => Product)
  class ProductReviewsResolver {
    @FieldResolver(() => [Review])
    async reviews(@Root() product: Product): Promise<Review[]> {
      return reviews.filter(review => review.product.upc === product.upc);
    }
  }

  @Resolver(() => User)
  class UserReviewsResolver {
    @FieldResolver(() => [Review])
    async reviews(@Root() user: User): Promise<Review[]> {
      return reviews.filter(review => review.author.id === user.id);
    }
  }

  return await buildSchema({
    resolvers: [ReviewsResolver, ProductReviewsResolver, UserReviewsResolver],
    directives: [...specifiedDirectives, ...federationDirectives],
    skipCheck: true,
  });
};

export async function listen(port: number): Promise<string> {
  const schema = buildFederatedSchema(await buildTypeSchema());

  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: true,
  });

  const { url } = await server.listen({ port });

  console.log(`🚀 Reviews service ready at ${url}`);

  return url;
}
