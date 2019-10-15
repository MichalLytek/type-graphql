import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";

/**
 * Role enum comment
 */
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}
registerEnumType(Role, {
  name: "Role",
  description: "Role enum comment",
});
