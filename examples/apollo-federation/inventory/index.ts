import federationDirectives from "@apollo/federation/dist/directives";
import { buildFederatedSchema } from "@apollo/federation";
import { specifiedDirectives } from "graphql";
import { ApolloServer } from "apollo-server";
import { plainToClass } from "class-transformer";
import {
  ObjectType,
  Field,
  Resolver,
  buildSchema,
  FieldResolver,
  Root,
  Directive,
} from "../../../src";
import { getMetadataStorage } from "../../../src/metadata/getMetadataStorage";

const buildTypeSchema = async () => {
  getMetadataStorage().clear();

  @ObjectType()
  @Directive("extends")
  @Directive("key", { fields: "upc" })
  class Product {
    @Field()
    @Directive("external")
    upc: string;

    @Field()
    @Directive("external")
    weight: number;

    @Field()
    @Directive("external")
    price: number;

    @Field()
    inStock: boolean;
  }

  interface Inventory {
    upc: string;
    inStock: boolean;
  }

  const inventory: Inventory[] = [
    { upc: "1", inStock: true },
    { upc: "2", inStock: false },
    { upc: "3", inStock: true },
  ];

  @Resolver(() => Product)
  class InventoryResolver {
    @FieldResolver(() => Number)
    @Directive("requires", { fields: "price weight" })
    async shippingEstimate(@Root() product: Product): Promise<number> {
      // free for expensive items
      if (product.price > 1000) {
        return 0;
      }

      // estimate is based on weight
      return product.weight * 0.5;
    }

    @FieldResolver(() => Product, { nullable: true })
    async __resolveReference(@Root() reference: Partial<Product>): Promise<Product | undefined> {
      const found = inventory.find(i => i.upc === reference.upc);

      if (!found) {
        return;
      }

      return plainToClass(Product, {
        ...reference,
        ...found,
      });
    }
  }

  return await buildSchema({
    resolvers: [InventoryResolver],
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

  console.log(`🚀 Inventory service ready at ${url}`);

  return url;
}
