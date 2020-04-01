import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieCreateInput } from "../../../inputs/MovieCreateInput";

@ArgsType()
export class CreateOneMovieArgs {
  @Field(_type => MovieCreateInput, { nullable: false })
  data!: MovieCreateInput;
}
