import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";

export enum PostKind {
  BLOG = "BLOG",
  ADVERT = "ADVERT"
}
registerEnumType(PostKind, {
  name: "PostKind",
  description: undefined,
});
