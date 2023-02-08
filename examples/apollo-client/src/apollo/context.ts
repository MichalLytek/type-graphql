import { InMemoryCache } from "@apollo/client";

export default interface ApolloContext {
  cache: InMemoryCache;
}
