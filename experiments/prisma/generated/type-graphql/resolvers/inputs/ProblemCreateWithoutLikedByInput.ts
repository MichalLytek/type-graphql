import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorCreateOneWithoutProblemsInput } from "../inputs/CreatorCreateOneWithoutProblemsInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ProblemCreateWithoutLikedByInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  problemText!: string;

  @TypeGraphQL.Field(_type => CreatorCreateOneWithoutProblemsInput, {
    nullable: true,
    description: undefined
  })
  creator?: CreatorCreateOneWithoutProblemsInput | undefined;
}
