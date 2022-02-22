import "reflect-metadata";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";

import * as accounts from "./accounts";
import * as reviews from "./reviews";
import * as products from "./products";
import * as inventory from "./inventory";

async function bootstrap() {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "accounts", url: await accounts.listen(3001) },
        { name: "reviews", url: await reviews.listen(3002) },
        { name: "products", url: await products.listen(3003) },
        { name: "inventory", url: await inventory.listen(3004) },
      ],
    }),
  });

  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
  });

  server.listen({ port: 3000 }).then(({ url }) => {
    console.log(`Apollo Gateway ready at ${url}`);
  });
}

bootstrap().catch(console.error);
