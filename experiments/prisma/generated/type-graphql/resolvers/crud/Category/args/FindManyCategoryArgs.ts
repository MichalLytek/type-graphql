import * as TypeGraphQL from "type-graphql";
import { CategoryOrderByInput } from "../../../inputs/CategoryOrderByInput";
import { CategoryWhereInput } from "../../../inputs/CategoryWhereInput";
import { CategoryWhereUniqueInput } from "../../../inputs/CategoryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindManyCategoryArgs {
  @TypeGraphQL.Field(_type => CategoryWhereInput, { nullable: true })
  where?: CategoryWhereInput | null;

  @TypeGraphQL.Field(_type => CategoryOrderByInput, { nullable: true })
  orderBy?: CategoryOrderByInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null;

  @TypeGraphQL.Field(_type => CategoryWhereUniqueInput, { nullable: true })
  after?: CategoryWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => CategoryWhereUniqueInput, { nullable: true })
  before?: CategoryWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null;
}
