import React, { FC } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

const DecrementButton: FC = () => (
  <Mutation<void>
    mutation={gql`
      mutation {
        decrementCounter @client
      }
    `}
  >
    {decrement => <button onClick={() => decrement()}>Decrement</button>}
  </Mutation>
);

export default DecrementButton;
