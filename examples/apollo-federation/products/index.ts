import federationDirectives from "@apollo/federation/dist/directives";
import { buildFederatedSchema } from "@apollo/federation";
import { specifiedDirectives } from "graphql";
import { ApolloServer } from "apollo-server";
import { plainToClass } from "class-transformer";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  buildSchema,
  FieldResolver,
  Arg,
  Root,
  Directive,
} from "../../../src";
import { getMetadataStorage } from "../../../src/metadata/getMetadataStorage";

const buildTypeSchema = async () => {
  getMetadataStorage().clear();

  @ObjectType()
  @Directive("key", { fields: "upc" })
  class Product {
    @Field()
    upc: string;

    @Field()
    name: string;

    @Field()
    price: number;

    @Field()
    weight: number;
  }

  const products: Product[] = plainToClass(Product, [
    {
      upc: "1",
      name: "Table",
      price: 899,
      weight: 100,
    },
    {
      upc: "2",
      name: "Couch",
      price: 1299,
      weight: 1000,
    },
    {
      upc: "3",
      name: "Chair",
      price: 54,
      weight: 50,
    },
  ]);

  @Resolver(() => Product)
  class ProductsResolver {
    @Query(() => [Product])
    async topProducts(@Arg("first", { defaultValue: 5 }) first: number): Promise<Product[]> {
      return products.slice(0, first);
    }

    @FieldResolver(() => Product, { nullable: true })
    async __resolveReference(@Root() reference: Partial<Product>): Promise<Product | undefined> {
      return products.find(p => p.upc === reference.upc);
    }
  }

  return await buildSchema({
    resolvers: [ProductsResolver],
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

  console.log(`🚀 Products service ready at ${url}`);

  return url;
}
