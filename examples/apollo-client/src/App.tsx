import React, { FC } from "react";
import { ApolloProvider, ApolloClient } from "@apollo/client";

import Counter from "./Counter/Counter";

const App: FC<{ client: ApolloClient<unknown> }> = ({ client }) => (
  <ApolloProvider client={client}>
    <Counter />
  </ApolloProvider>
);

export default App;
