import { DocumentNode, ExecutionResult } from "graphql";
import { ApolloClient } from "apollo-client";

export interface Options {
  query: DocumentNode;
  apollo: ApolloClient<any>;
}
export function apolloSubscribeToPromise({ apollo, query }: Options): Promise<ExecutionResult> {
  return new Promise((resolve, reject) => {
    apollo.subscribe({ query }).subscribe({ next: resolve, error: reject });
  });
}
