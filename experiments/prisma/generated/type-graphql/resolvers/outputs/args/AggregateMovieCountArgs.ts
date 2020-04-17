import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieOrderByInput } from "../../inputs/MovieOrderByInput";
import { MovieWhereInput } from "../../inputs/MovieWhereInput";
import { MovieWhereUniqueInput } from "../../inputs/MovieWhereUniqueInput";

@ArgsType()
export class AggregateMovieCountArgs {
  @Field(_type => MovieWhereInput, { nullable: true })
  where?: MovieWhereInput | null;

  @Field(_type => MovieOrderByInput, { nullable: true })
  orderBy?: MovieOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => MovieWhereUniqueInput, { nullable: true })
  after?: MovieWhereUniqueInput | null;

  @Field(_type => MovieWhereUniqueInput, { nullable: true })
  before?: MovieWhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
