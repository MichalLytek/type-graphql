import { ArgsDictionary } from "./ResolverData";
import { ResolverFilterData } from "./ResolverFilterData";

export type ResolverTopicData<
  TPayload = any,
  TArgs = ArgsDictionary,
  TContext = {},
> = ResolverFilterData<TPayload, TArgs, TContext>;
