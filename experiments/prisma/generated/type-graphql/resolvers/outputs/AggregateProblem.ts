import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ProblemAvgAggregateOutputType } from "../outputs/ProblemAvgAggregateOutputType";
import { ProblemMaxAggregateOutputType } from "../outputs/ProblemMaxAggregateOutputType";
import { ProblemMinAggregateOutputType } from "../outputs/ProblemMinAggregateOutputType";
import { ProblemSumAggregateOutputType } from "../outputs/ProblemSumAggregateOutputType";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateProblem {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count!: number;

  @TypeGraphQL.Field(_type => ProblemAvgAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  avg!: ProblemAvgAggregateOutputType | null;

  @TypeGraphQL.Field(_type => ProblemSumAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  sum!: ProblemSumAggregateOutputType | null;

  @TypeGraphQL.Field(_type => ProblemMinAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  min!: ProblemMinAggregateOutputType | null;

  @TypeGraphQL.Field(_type => ProblemMaxAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  max!: ProblemMaxAggregateOutputType | null;
}
