import { ApolloServer } from "apollo-server";

import ProductsResolver from "./resolver";
import Product from "./product";
import { resolveProductReference } from "./product-reference";
import { buildFederatedSchema } from "../helpers/buildFederatedSchema";

export async function listen(port: number): Promise<string> {
  const schema = await buildFederatedSchema(
    {
      resolvers: [ProductsResolver],
      orphanedTypes: [Product],
    },
    {
      Product: { __resolveReference: resolveProductReference },
    },
  );

  const server = new ApolloServer({ schema });

  const { url } = await server.listen({ port });

  console.log(`Products service ready at ${url}`);

  return url;
}
