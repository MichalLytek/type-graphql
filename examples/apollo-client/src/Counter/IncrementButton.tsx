import React, { FC } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

const IncrementButton: FC = () => {
  const [increment] = useMutation<() => void>(gql`
    mutation {
      incrementCounter @client
    }
  `);

  return <button onClick={() => increment()}>Increment</button>;
};

export default IncrementButton;
