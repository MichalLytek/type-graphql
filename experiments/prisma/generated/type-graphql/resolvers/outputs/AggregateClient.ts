import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ClientAvgAggregateOutputType } from "../outputs/ClientAvgAggregateOutputType";
import { ClientMaxAggregateOutputType } from "../outputs/ClientMaxAggregateOutputType";
import { ClientMinAggregateOutputType } from "../outputs/ClientMinAggregateOutputType";
import { ClientSumAggregateOutputType } from "../outputs/ClientSumAggregateOutputType";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateClient {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count!: number;

  @TypeGraphQL.Field(_type => ClientAvgAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  avg?: ClientAvgAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => ClientSumAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  sum?: ClientSumAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => ClientMinAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  min?: ClientMinAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => ClientMaxAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  max?: ClientMaxAggregateOutputType | undefined;
}
