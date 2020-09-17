import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ProblemCreateInput } from "../../../inputs/ProblemCreateInput";

@TypeGraphQL.ArgsType()
export class CreateProblemArgs {
  @TypeGraphQL.Field(_type => ProblemCreateInput, { nullable: false })
  data!: ProblemCreateInput;
}
