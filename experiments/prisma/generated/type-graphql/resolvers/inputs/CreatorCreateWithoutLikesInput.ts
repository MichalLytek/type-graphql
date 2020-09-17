import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ProblemCreateManyWithoutCreatorInput } from "../inputs/ProblemCreateManyWithoutCreatorInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorCreateWithoutLikesInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @TypeGraphQL.Field(_type => ProblemCreateManyWithoutCreatorInput, {
    nullable: true,
    description: undefined
  })
  problems?: ProblemCreateManyWithoutCreatorInput | undefined;
}
