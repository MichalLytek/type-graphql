import * as TypeGraphQL from "type-graphql";
import { DirectorCreateInput } from "../../../inputs/DirectorCreateInput";

@TypeGraphQL.ArgsType()
export class CreateDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorCreateInput, { nullable: false })
  data!: DirectorCreateInput;
}
