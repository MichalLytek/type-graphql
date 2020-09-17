import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ProblemScalarWhereInput } from "../inputs/ProblemScalarWhereInput";
import { ProblemUpdateManyDataInput } from "../inputs/ProblemUpdateManyDataInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ProblemUpdateManyWithWhereNestedInput {
  @TypeGraphQL.Field(_type => ProblemScalarWhereInput, {
    nullable: false,
    description: undefined
  })
  where!: ProblemScalarWhereInput;

  @TypeGraphQL.Field(_type => ProblemUpdateManyDataInput, {
    nullable: false,
    description: undefined
  })
  data!: ProblemUpdateManyDataInput;
}
