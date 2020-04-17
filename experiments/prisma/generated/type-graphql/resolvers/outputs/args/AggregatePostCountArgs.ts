import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostOrderByInput } from "../../inputs/PostOrderByInput";
import { PostWhereInput } from "../../inputs/PostWhereInput";
import { PostWhereUniqueInput } from "../../inputs/PostWhereUniqueInput";

@ArgsType()
export class AggregatePostCountArgs {
  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;

  @Field(_type => PostOrderByInput, { nullable: true })
  orderBy?: PostOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => PostWhereUniqueInput, { nullable: true })
  after?: PostWhereUniqueInput | null;

  @Field(_type => PostWhereUniqueInput, { nullable: true })
  before?: PostWhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
