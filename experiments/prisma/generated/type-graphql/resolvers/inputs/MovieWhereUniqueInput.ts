import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput } from "../inputs/DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieWhereUniqueInput {
  @Field(_type => DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput, {
    nullable: true,
    description: undefined
  })
  directorFirstName_directorLastName_title?: DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput | null;
}
