import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
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
  every?: MovieWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: MovieWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: MovieWhereInput | null | undefined;
}
