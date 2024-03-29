import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AccountsResolver } from "./resolver";
import { User } from "./user";
import { resolveUserReference } from "./user.reference";
import { buildFederatedSchema } from "../helpers";

export async function listen(port: number): Promise<string> {
  // Build TypeGraphQL executable schema
  const schema = await buildFederatedSchema(
    {
      resolvers: [AccountsResolver],
      orphanedTypes: [User],
    },
    {
      User: { __resolveReference: resolveUserReference },
    },
  );

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Accounts service ready at ${url}`);

  return url;
}
