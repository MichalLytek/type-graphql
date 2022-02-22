import React, { FC } from "react";
import { gql, useQuery } from "@apollo/client";

import IncrementButton from "./IncrementButton";
import DecrementButton from "./DecrementButton";
import CounterType from "./counter.type";

const Counter: FC = () => {
  const { data, loading } = useQuery<{ counter: CounterType }>(gql`
    query {
      counter @client {
        value
      }
    }
  `);

  return (
    <>
      <h1>Counter:</h1>
      <h2>{loading ? "Loading..." : data!.counter.value}</h2>
      <IncrementButton />
      <DecrementButton />
    </>
  );
};

export default Counter;
