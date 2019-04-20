import React, { FC } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import IncrementButton from "./IncrementButton";
import DecrementButton from "./DecrementButton";
import CounterType from "./counter.type";

const Counter: FC = () => (
  <Query<{ counter: CounterType }>
    query={gql`
      query {
        counter @client {
          value
        }
      }
    `}
  >
    {({ data, loading }) => (
      <>
        <h1>Counter:</h1>
        <h2>{loading ? "Loading..." : data!.counter.value}</h2>
        <IncrementButton />
        <DecrementButton />
      </>
    )}
  </Query>
);

export default Counter;
