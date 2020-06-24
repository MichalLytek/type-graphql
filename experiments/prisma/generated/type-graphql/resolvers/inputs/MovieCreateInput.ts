import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { DirectorCreateOneWithoutMoviesInput } from "../inputs/DirectorCreateOneWithoutMoviesInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  title!: string;

  @TypeGraphQL.Field(_type => DirectorCreateOneWithoutMoviesInput, {
    nullable: false,
    description: undefined
  })
  director!: DirectorCreateOneWithoutMoviesInput;
}
