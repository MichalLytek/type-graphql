import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { MovieListRelationFilter } from "../inputs/MovieListRelationFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorWhereInput {
  @TypeGraphQL.Field(_type => [DirectorWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: DirectorWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [DirectorWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: DirectorWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [DirectorWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: DirectorWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  firstName?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  lastName?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => MovieListRelationFilter, {
    nullable: true,
    description: undefined
  })
  movies?: MovieListRelationFilter | undefined;
}
