import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CategoryOrderByInput } from "../../../inputs/CategoryOrderByInput";
import { CategoryWhereInput } from "../../../inputs/CategoryWhereInput";
import { CategoryWhereUniqueInput } from "../../../inputs/CategoryWhereUniqueInput";

@ArgsType()
export class FindManyCategoryArgs {
  @Field(_type => CategoryWhereInput, { nullable: true })
  where?: CategoryWhereInput | null;

  @Field(_type => CategoryOrderByInput, { nullable: true })
  orderBy?: CategoryOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => CategoryWhereUniqueInput, { nullable: true })
  after?: CategoryWhereUniqueInput | null;

  @Field(_type => CategoryWhereUniqueInput, { nullable: true })
  before?: CategoryWhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
