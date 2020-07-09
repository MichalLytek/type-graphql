import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { PostAvgAggregateOutputType } from "../outputs/PostAvgAggregateOutputType";
import { PostMaxAggregateOutputType } from "../outputs/PostMaxAggregateOutputType";
import { PostMinAggregateOutputType } from "../outputs/PostMinAggregateOutputType";
import { PostSumAggregateOutputType } from "../outputs/PostSumAggregateOutputType";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregatePost {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count!: number;

  @TypeGraphQL.Field(_type => PostAvgAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  avg?: PostAvgAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => PostSumAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  sum?: PostSumAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => PostMinAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  min?: PostMinAggregateOutputType | undefined;

  @TypeGraphQL.Field(_type => PostMaxAggregateOutputType, {
    nullable: true,
    description: undefined
  })
  max?: PostMaxAggregateOutputType | undefined;
}
