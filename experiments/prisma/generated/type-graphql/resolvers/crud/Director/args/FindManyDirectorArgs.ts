import * as TypeGraphQL from "type-graphql";
import { DirectorOrderByInput } from "../../../inputs/DirectorOrderByInput";
import { DirectorWhereInput } from "../../../inputs/DirectorWhereInput";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindManyDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | null;

  @TypeGraphQL.Field(_type => DirectorOrderByInput, { nullable: true })
  orderBy?: DirectorOrderByInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null;

  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: true })
  after?: DirectorWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: true })
  before?: DirectorWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null;
}
