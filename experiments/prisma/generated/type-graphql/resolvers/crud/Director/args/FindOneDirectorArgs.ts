import * as TypeGraphQL from "type-graphql";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindOneDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: false })
  where!: DirectorWhereUniqueInput;
}
