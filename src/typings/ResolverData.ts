import type { GraphQLResolveInfo } from "graphql";

export type ArgsDictionary = Record<string, any>;

export type ResolverData<TContextType extends object = object> = {
  root: any;
  args: ArgsDictionary;
  context: TContextType;
  info: GraphQLResolveInfo;
};
