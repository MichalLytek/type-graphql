import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ProblemUpdateInput } from "../../../inputs/ProblemUpdateInput";
import { ProblemWhereUniqueInput } from "../../../inputs/ProblemWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateProblemArgs {
  @TypeGraphQL.Field(_type => ProblemUpdateInput, { nullable: false })
  data!: ProblemUpdateInput;

  @TypeGraphQL.Field(_type => ProblemWhereUniqueInput, { nullable: false })
  where!: ProblemWhereUniqueInput;
}
