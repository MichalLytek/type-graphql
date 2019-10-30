import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostOrderByInput } from "../../../inputs/PostOrderByInput";
import { PostWhereInput } from "../../../inputs/PostWhereInput";

@ArgsType()
export class FindManyPostArgs {
  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;

  @Field(_type => PostOrderByInput, { nullable: true })
  orderBy?: PostOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => ID, { nullable: true })
  after?: string | null;

  @Field(_type => ID, { nullable: true })
  before?: string | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
