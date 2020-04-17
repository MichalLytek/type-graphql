import * as TypeGraphQL from "type-graphql";
import { DirectorCreateInput } from "../../../inputs/DirectorCreateInput";
import { DirectorUpdateInput } from "../../../inputs/DirectorUpdateInput";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertOneDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: false })
  where!: DirectorWhereUniqueInput;

  @TypeGraphQL.Field(_type => DirectorCreateInput, { nullable: false })
  create!: DirectorCreateInput;

  @TypeGraphQL.Field(_type => DirectorUpdateInput, { nullable: false })
  update!: DirectorUpdateInput;
}
