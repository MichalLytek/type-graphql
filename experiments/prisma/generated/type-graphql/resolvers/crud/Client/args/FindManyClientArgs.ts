import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ClientOrderByInput } from "../../../inputs/ClientOrderByInput";
import { ClientWhereInput } from "../../../inputs/ClientWhereInput";
import { ClientWhereUniqueInput } from "../../../inputs/ClientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindManyClientArgs {
  @TypeGraphQL.Field(_type => ClientWhereInput, { nullable: true })
  where?: ClientWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => ClientOrderByInput, { nullable: true })
  orderBy?: ClientOrderByInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null | undefined;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: true })
  after?: ClientWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: true })
  before?: ClientWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null | undefined;
}
