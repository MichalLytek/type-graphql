import { ApolloServer } from "apollo-server";

import InventoryResolver from "./resolver";
import Product from "./product";
import { resolveProductReference } from "./product-reference";
import { buildFederatedSchema } from "../helpers/buildFederatedSchema";

export async function listen(port: number): Promise<string> {
  const schema = await buildFederatedSchema(
    {
      resolvers: [InventoryResolver],
      orphanedTypes: [Product],
    },
    {
      Product: { __resolveReference: resolveProductReference },
    },
  );

  const server = new ApolloServer({ schema });

  const { url } = await server.listen({ port });
  console.log(`Inventory service ready at ${url}`);

  return url;
}
