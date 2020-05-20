import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { PostOrderByInput } from "../../inputs/PostOrderByInput";
import { PostWhereInput } from "../../inputs/PostWhereInput";
import { PostWhereUniqueInput } from "../../inputs/PostWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregatePostCountArgs {
  @TypeGraphQL.Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => PostOrderByInput, { nullable: true })
  orderBy?: PostOrderByInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null | undefined;

  @TypeGraphQL.Field(_type => PostWhereUniqueInput, { nullable: true })
  after?: PostWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => PostWhereUniqueInput, { nullable: true })
  before?: PostWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null | undefined;
}
