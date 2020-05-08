import * as TypeGraphQL from "type-graphql";
import { DirectorUpdateInput } from "../../../inputs/DirectorUpdateInput";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorUpdateInput, { nullable: false })
  data!: DirectorUpdateInput;

  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: false })
  where!: DirectorWhereUniqueInput;
}
