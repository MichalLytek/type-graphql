import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UserOrderByInput } from "../../inputs/UserOrderByInput";
import { UserWhereInput } from "../../inputs/UserWhereInput";
import { UserWhereUniqueInput } from "../../inputs/UserWhereUniqueInput";

@ArgsType()
export class AggregateUserCountArgs {
  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;

  @Field(_type => UserOrderByInput, { nullable: true })
  orderBy?: UserOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => UserWhereUniqueInput, { nullable: true })
  after?: UserWhereUniqueInput | null;

  @Field(_type => UserWhereUniqueInput, { nullable: true })
  before?: UserWhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
