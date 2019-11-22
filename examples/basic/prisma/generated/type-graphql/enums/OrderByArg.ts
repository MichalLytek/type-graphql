import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

export enum OrderByArg {
  asc = "asc",
  desc = "desc"
}
registerEnumType(OrderByArg, {
  name: "OrderByArg",
  description: undefined,
});
