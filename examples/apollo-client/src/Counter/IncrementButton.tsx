import React, { FC } from "react";
import { gql, useMutation } from "@apollo/client";

const IncrementButton: FC = () => {
  const [increment] = useMutation<() => void>(gql`
    mutation {
      incrementCounter @client
    }
  `);

  return <button onClick={() => increment()}>Increment</button>;
};

export default IncrementButton;
