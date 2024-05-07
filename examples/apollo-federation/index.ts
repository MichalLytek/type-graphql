import "reflect-metadata";
import path from "node:path";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { emitSchemaDefinitionFile } from "type-graphql";
import * as accounts from "./accounts";
import * as inventory from "./inventory";
import * as products from "./products";
import * as reviews from "./reviews";

async function bootstrap() {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "accounts", url: await accounts.listen(4001) },
        { name: "reviews", url: await reviews.listen(4002) },
        { name: "products", url: await products.listen(4003) },
        { name: "inventory", url: await inventory.listen(4004) },
      ],
    }),
  });

  // Create GraphQL server
  const server = new ApolloServer({ gateway });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`Apollo Gateway ready at ${url}`);

  // Create 'schema.graphql' file with schema definition in current directory
  await emitSchemaDefinitionFile(path.resolve(__dirname, "schema.graphql"), gateway.schema!);
}

bootstrap().catch(console.error);
