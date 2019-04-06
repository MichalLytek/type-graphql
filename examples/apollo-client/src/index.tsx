import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import createApolloClient from "./apollo/client";

async function bootstrap() {
  const client = await createApolloClient();
  ReactDOM.render(<App client={client} />, document.getElementById("root")!);
}

bootstrap();
