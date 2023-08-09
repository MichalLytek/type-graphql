import "reflect-metadata";
import path from "path";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { emitSchemaDefinitionFile } from "type-graphql";
import * as accounts from "./accounts";
import * as inventory from "./inventory";
import * as products from "./products";
import * as reviews from "./reviews";

const startGraph = async (name: string, urlOrPromise: string | Promise<string>) => {
  const url = await urlOrPromise;
  return { name, url };
};

async function bootstrap() {
  const subgraphs = await Promise.all([
    startGraph("accounts", accounts.listen(4001)),
    startGraph("reviews", reviews.listen(4002)),
    startGraph("products", products.listen(4003)),
    startGraph("inventory", inventory.listen(4004)),
  ]);

  const schemaGateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs,
    }),
  });
  const { schema } = await schemaGateway.load();
  await emitSchemaDefinitionFile(path.resolve(__dirname, "schema.graphql"), schema);
  await schemaGateway.stop();

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs,
    }),
  });
  const server = new ApolloServer({ gateway });

  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

  console.log(`Apollo Gateway ready at ${url}`);
}

bootstrap().catch(console.error);
