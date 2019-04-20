import { ApolloCache } from "apollo-cache";

export default interface ApolloContext {
  cache: ApolloCache<any>;
}
