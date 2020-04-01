import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorUpdateOneRequiredWithoutMoviesInput } from "../inputs/DirectorUpdateOneRequiredWithoutMoviesInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  title?: string | null;

  @Field(_type => DirectorUpdateOneRequiredWithoutMoviesInput, {
    nullable: true,
    description: undefined
  })
  director?: DirectorUpdateOneRequiredWithoutMoviesInput | null;
}
