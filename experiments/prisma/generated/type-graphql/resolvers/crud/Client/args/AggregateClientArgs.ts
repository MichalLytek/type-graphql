import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ClientOrderByInput } from "../../../inputs/ClientOrderByInput";
import { ClientWhereInput } from "../../../inputs/ClientWhereInput";
import { ClientWhereUniqueInput } from "../../../inputs/ClientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateClientArgs {
  @TypeGraphQL.Field(_type => ClientWhereInput, { nullable: true })
  where?: ClientWhereInput | undefined;

  @TypeGraphQL.Field(_type => ClientOrderByInput, { nullable: true })
  orderBy?: ClientOrderByInput | undefined;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: true })
  cursor?: ClientWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | undefined;
}
