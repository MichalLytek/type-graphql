import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UserOrderByInput } from "../../../inputs/UserOrderByInput";
import { UserWhereInput } from "../../../inputs/UserWhereInput";

@ArgsType()
export class FindManyUserArgs {
  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;

  @Field(_type => UserOrderByInput, { nullable: true })
  orderBy?: UserOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => String, { nullable: true })
  after?: string | null;

  @Field(_type => String, { nullable: true })
  before?: string | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
