import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieCreateInput } from "../../../inputs/MovieCreateInput";
import { MovieUpdateInput } from "../../../inputs/MovieUpdateInput";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@ArgsType()
export class UpsertOneMovieArgs {
  @Field(_type => MovieWhereUniqueInput, { nullable: false })
  where!: MovieWhereUniqueInput;

  @Field(_type => MovieCreateInput, { nullable: false })
  create!: MovieCreateInput;

  @Field(_type => MovieUpdateInput, { nullable: false })
  update!: MovieUpdateInput;
}
