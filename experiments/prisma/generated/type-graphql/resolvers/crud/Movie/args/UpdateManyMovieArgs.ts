import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieUpdateManyMutationInput } from "../../../inputs/MovieUpdateManyMutationInput";
import { MovieWhereInput } from "../../../inputs/MovieWhereInput";

@ArgsType()
export class UpdateManyMovieArgs {
  @Field(_type => MovieUpdateManyMutationInput, { nullable: false })
  data!: MovieUpdateManyMutationInput;

  @Field(_type => MovieWhereInput, { nullable: true })
  where?: MovieWhereInput | null;
}
