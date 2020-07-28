import * as src from "./allExports";

const shim = process.env.TYPE_GRAPHQL_SHIM;

export const dummyValue = "";
export function dummyFn() {
  return;
}
export function dummyDecorator() {
  return dummyFn;
}

export const Arg: typeof src.Arg = shim ? dummyDecorator : src.Arg;
export const Args: typeof src.Args = shim ? dummyDecorator : src.Args;
export const ArgsType: typeof src.ArgsType = shim ? dummyDecorator : src.ArgsType;
export const Authorized: typeof src.Authorized = shim ? dummyDecorator : src.Authorized;
export const Ctx: typeof src.Ctx = shim ? dummyDecorator : src.Ctx;
export const registerEnumType: typeof src.registerEnumType = shim ? dummyFn : src.registerEnumType;
export const Field: typeof src.Field = shim ? dummyDecorator : src.Field;
export const FieldResolver: typeof src.FieldResolver = shim ? dummyDecorator : src.FieldResolver;
export const Info: typeof src.Info = shim ? dummyDecorator : src.Info;
export const InputType: typeof src.InputType = shim ? dummyDecorator : src.InputType;
export const InterfaceType: typeof src.InterfaceType = shim ? dummyDecorator : src.InterfaceType;
export const Mutation: typeof src.Mutation = shim ? dummyDecorator : src.Mutation;
export const ObjectType: typeof src.ObjectType = shim ? dummyDecorator : src.ObjectType;
export const PubSub: typeof src.PubSub = shim ? dummyDecorator : src.PubSub;
export const Query: typeof src.Query = shim ? dummyDecorator : src.Query;
export const Resolver: typeof src.Resolver = shim ? dummyDecorator : src.Resolver;
export const Root: typeof src.Root = shim ? dummyDecorator : src.Root;
export const Subscription: typeof src.Subscription = shim ? dummyDecorator : src.Subscription;
export const createUnionType: typeof src.createUnionType = shim
  ? (dummyFn as any)
  : src.createUnionType;
export const UseMiddleware: typeof src.UseMiddleware = shim ? dummyDecorator : src.UseMiddleware;
export const Int: typeof src.Int = shim ? (dummyValue as any) : src.Int;
export const Float: typeof src.Float = shim ? (dummyValue as any) : src.Float;
export const ID: typeof src.ID = shim ? (dummyValue as any) : src.ID;
export const GraphQLISODateTime: typeof src.GraphQLISODateTime = shim
  ? (dummyValue as any)
  : src.GraphQLISODateTime;
export const GraphQLTimestamp: typeof src.GraphQLTimestamp = shim
  ? (dummyValue as any)
  : src.GraphQLTimestamp;

export const buildSchema: typeof src.buildSchema | null = shim ? null : src.buildSchema;
export const Directive: typeof src.Directive | null = shim ? null : src.Directive;
