import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";
import { UserCreateInput } from "../inputs/UserCreateInput";
import { UserUpdateInput } from "../inputs/UserUpdateInput";

@ArgsType()
export class UpsertOneUserArgs {
  @Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;

  @Field(_type => UserCreateInput, { nullable: false })
  create!: UserCreateInput;

  @Field(_type => UserUpdateInput, { nullable: false })
  update!: UserUpdateInput;
}
