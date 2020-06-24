import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput } from "../inputs/DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieWhereUniqueInput {
  @TypeGraphQL.Field(_type => DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput, {
    nullable: true,
    description: undefined
  })
  directorFirstName_directorLastName_title?: DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput | undefined;
}
