import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CategoryAvgAggregateOutputType } from "../outputs/CategoryAvgAggregateOutputType";
import { CategoryMaxAggregateOutputType } from "../outputs/CategoryMaxAggregateOutputType";
import { CategoryMinAggregateOutputType } from "../outputs/CategoryMinAggregateOutputType";
import { CategorySumAggregateOutputType } from "../outputs/CategorySumAggregateOutputType";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateCategory {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count!: number;

  @TypeGraphQL.Field(_type => CategoryAvgAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  avg?: CategoryAvgAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => CategorySumAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  sum?: CategorySumAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => CategoryMinAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  min?: CategoryMinAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => CategoryMaxAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  max?: CategoryMaxAggregateOutputType | undefined;
}
