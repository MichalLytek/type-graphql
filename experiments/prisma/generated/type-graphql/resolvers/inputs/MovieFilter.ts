import * as TypeGraphQL from "type-graphql";
import { MovieWhereInput } from "../inputs/MovieWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieFilter {
  @TypeGraphQL.Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: MovieWhereInput | null;

  @TypeGraphQL.Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: MovieWhereInput | null;

  @TypeGraphQL.Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: MovieWhereInput | null;
}
