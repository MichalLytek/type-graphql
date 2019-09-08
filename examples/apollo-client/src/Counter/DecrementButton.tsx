import React, { FC } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

const DecrementButton: FC = () => {
  const [decrement] = useMutation<() => void>(gql`
    mutation {
      decrementCounter @client
    }
  `);

  return <button onClick={() => decrement()}>Decrement</button>;
};

export default DecrementButton;
