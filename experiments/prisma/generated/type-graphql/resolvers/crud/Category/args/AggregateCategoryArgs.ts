import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { CategoryOrderByInput } from "../../../inputs/CategoryOrderByInput";
import { CategoryWhereInput } from "../../../inputs/CategoryWhereInput";
import { CategoryWhereUniqueInput } from "../../../inputs/CategoryWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateCategoryArgs {
  @TypeGraphQL.Field(_type => CategoryWhereInput, { nullable: true })
  where?: CategoryWhereInput | undefined;

  @TypeGraphQL.Field(_type => CategoryOrderByInput, { nullable: true })
  orderBy?: CategoryOrderByInput | undefined;

  @TypeGraphQL.Field(_type => CategoryWhereUniqueInput, { nullable: true })
  cursor?: CategoryWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | undefined;
}
