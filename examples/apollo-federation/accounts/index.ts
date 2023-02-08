import { ApolloServer } from "apollo-server";

import AccountsResolver from "./resolver";
import User from "./user";
import { buildFederatedSchema } from "../helpers/buildFederatedSchema";
import { resolveUserReference } from "./user-reference";

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

  const { url } = await server.listen({ port });
  console.log(`Accounts service ready at ${url}`);

  return url;
}
