import { type ArgsDictionary } from "./ResolverData";
import { type ResolverFilterData } from "./ResolverFilterData";

export type ResolverTopicData<
  TPayload = any,
  TArgs = ArgsDictionary,
  TContext = {},
> = ResolverFilterData<TPayload, TArgs, TContext>;
