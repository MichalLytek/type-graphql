import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { CategoryOrderByInput } from "../../inputs/CategoryOrderByInput";
import { CategoryWhereInput } from "../../inputs/CategoryWhereInput";
import { CategoryWhereUniqueInput } from "../../inputs/CategoryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCategoryCountArgs {
  @TypeGraphQL.Field(_type => CategoryWhereInput, { nullable: true })
  where?: CategoryWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => CategoryOrderByInput, { nullable: true })
  orderBy?: CategoryOrderByInput | null | undefined;

  @TypeGraphQL.Field(_type => CategoryWhereUniqueInput, { nullable: true })
  cursor?: CategoryWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null | undefined;
}
