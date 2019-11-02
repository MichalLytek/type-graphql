import { ApolloServer } from "apollo-server";

import ProductsResolver from "./resolver";
import Product, { resolveProductReference } from "./product";
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

  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: true,
  });

  const { url } = await server.listen({ port });

  console.log(`Products service ready at ${url}`);

  return url;
}
