import { ResolverFilterData } from "./ResolverFilterData";
import { ArgsDictionary } from "./ResolverData";

export type ResolverTopicData<
  TPayload = any,
  TArgs = ArgsDictionary,
  TContext = {},
> = ResolverFilterData<TPayload, TArgs, TContext>;
