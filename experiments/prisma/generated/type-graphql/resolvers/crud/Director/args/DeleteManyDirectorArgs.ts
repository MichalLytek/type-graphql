import * as TypeGraphQL from "type-graphql";
import { DirectorWhereInput } from "../../../inputs/DirectorWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | null;
}
