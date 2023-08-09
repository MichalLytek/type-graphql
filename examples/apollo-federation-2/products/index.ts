import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import Product from "./product";
import { resolveProductReference } from "./product-reference";
import ProductsResolver from "./resolver";
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

  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Products service ready at ${url}`);

  return url;
}
