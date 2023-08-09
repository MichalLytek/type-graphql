import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import AccountsResolver from "./resolver";
import User from "./user";
import { resolveUserReference } from "./user-reference";
import { buildFederatedSchema } from "../helpers/buildFederatedSchema";

export async function listen(port: number): Promise<string> {
  const schema = await buildFederatedSchema(
    {
      resolvers: [AccountsResolver],
      orphanedTypes: [User],
    },
    {
      User: { __resolveReference: resolveUserReference },
    },
  );

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`Accounts service ready at ${url}`);

  return url;
}
