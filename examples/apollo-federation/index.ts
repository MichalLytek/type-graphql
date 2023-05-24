import "reflect-metadata";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import path from "path";
import { emitSchemaDefinitionFile } from "../../src";

import * as accounts from "./accounts";
import * as reviews from "./reviews";
import * as products from "./products";
import * as inventory from "./inventory";

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

  const { schema, executor } = await gateway.load();

  await emitSchemaDefinitionFile(path.resolve(__dirname, "schema.graphql"), schema);

  const server = new ApolloServer({
    schema,
    executor,
  });

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Apollo Gateway ready at ${url}`);
  });
}

bootstrap().catch(console.error);
