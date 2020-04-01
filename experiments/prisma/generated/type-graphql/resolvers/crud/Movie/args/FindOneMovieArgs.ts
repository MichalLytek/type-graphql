import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@ArgsType()
export class FindOneMovieArgs {
  @Field(_type => MovieWhereUniqueInput, { nullable: false })
  where!: MovieWhereUniqueInput;
}
