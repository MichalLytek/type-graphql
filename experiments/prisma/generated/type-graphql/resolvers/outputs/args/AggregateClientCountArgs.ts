import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ClientOrderByInput } from "../../inputs/ClientOrderByInput";
import { ClientWhereInput } from "../../inputs/ClientWhereInput";
import { ClientWhereUniqueInput } from "../../inputs/ClientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateClientCountArgs {
  @TypeGraphQL.Field(_type => ClientWhereInput, { nullable: true })
  where?: ClientWhereInput | null;

  @TypeGraphQL.Field(_type => ClientOrderByInput, { nullable: true })
  orderBy?: ClientOrderByInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: true })
  after?: ClientWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: true })
  before?: ClientWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null;
}
