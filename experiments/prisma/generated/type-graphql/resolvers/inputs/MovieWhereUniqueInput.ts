import * as TypeGraphQL from "type-graphql";
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
  directorFirstName_directorLastName_title?: DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput | null;
}
