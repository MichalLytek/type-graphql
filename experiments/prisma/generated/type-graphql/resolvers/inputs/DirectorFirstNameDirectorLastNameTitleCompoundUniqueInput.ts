import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  directorFirstName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  directorLastName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  title!: string;
}
