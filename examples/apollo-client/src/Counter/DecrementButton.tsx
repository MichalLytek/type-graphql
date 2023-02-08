import React, { FC } from "react";
import { gql, useMutation } from "@apollo/client";

const DecrementButton: FC = () => {
  const [decrement] = useMutation<() => void>(gql`
    mutation {
      decrementCounter @client
    }
  `);

  return <button onClick={() => decrement()}>Decrement</button>;
};

export default DecrementButton;
