import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorAvgAggregateOutputType } from "../outputs/CreatorAvgAggregateOutputType";
import { CreatorMaxAggregateOutputType } from "../outputs/CreatorMaxAggregateOutputType";
import { CreatorMinAggregateOutputType } from "../outputs/CreatorMinAggregateOutputType";
import { CreatorSumAggregateOutputType } from "../outputs/CreatorSumAggregateOutputType";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateCreator {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count!: number;

  @TypeGraphQL.Field(_type => CreatorAvgAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  avg!: CreatorAvgAggregateOutputType | null;

  @TypeGraphQL.Field(_type => CreatorSumAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  sum!: CreatorSumAggregateOutputType | null;

  @TypeGraphQL.Field(_type => CreatorMinAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  min!: CreatorMinAggregateOutputType | null;

  @TypeGraphQL.Field(_type => CreatorMaxAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  max!: CreatorMaxAggregateOutputType | null;
}
