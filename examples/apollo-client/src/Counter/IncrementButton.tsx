import React, { FC } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

const IncrementButton: FC = () => (
  <Mutation<void>
    mutation={gql`
      mutation {
        incrementCounter @client
      }
    `}
  >
    {increment => <button onClick={() => increment()}>Increment</button>}
  </Mutation>
);

export default IncrementButton;
