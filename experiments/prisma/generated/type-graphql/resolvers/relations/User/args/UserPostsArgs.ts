import * as TypeGraphQL from "type-graphql";
import { PostOrderByInput } from "../../../inputs/PostOrderByInput";
import { PostWhereInput } from "../../../inputs/PostWhereInput";
import { PostWhereUniqueInput } from "../../../inputs/PostWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UserPostsArgs {
  @TypeGraphQL.Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;

  @TypeGraphQL.Field(_type => PostOrderByInput, { nullable: true })
  orderBy?: PostOrderByInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null;

  @TypeGraphQL.Field(_type => PostWhereUniqueInput, { nullable: true })
  after?: PostWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => PostWhereUniqueInput, { nullable: true })
  before?: PostWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null;
}
