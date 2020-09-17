import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ProblemWhereInput } from "../../../inputs/ProblemWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyProblemArgs {
  @TypeGraphQL.Field(_type => ProblemWhereInput, { nullable: true })
  where?: ProblemWhereInput | undefined;
}
