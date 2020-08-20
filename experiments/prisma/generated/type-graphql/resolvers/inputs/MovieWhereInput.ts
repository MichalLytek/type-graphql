import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { DirectorWhereInput } from "../inputs/DirectorWhereInput";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieWhereInput {
  @TypeGraphQL.Field(_type => [MovieWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: MovieWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [MovieWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: MovieWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [MovieWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: MovieWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  directorFirstName?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  directorLastName?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => DirectorWhereInput, {
    nullable: true,
    description: undefined
  })
  director?: DirectorWhereInput | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  title?: StringFilter | undefined;
}
