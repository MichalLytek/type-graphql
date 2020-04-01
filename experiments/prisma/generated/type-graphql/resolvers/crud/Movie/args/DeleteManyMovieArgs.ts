import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieWhereInput } from "../../../inputs/MovieWhereInput";

@ArgsType()
export class DeleteManyMovieArgs {
  @Field(_type => MovieWhereInput, { nullable: true })
  where?: MovieWhereInput | null;
}
