import * as TypeGraphQL from "type-graphql";

export enum ProblemDistinctFieldEnum {
  id = "id",
  problemText = "problemText",
  creatorId = "creatorId"
}
TypeGraphQL.registerEnumType(ProblemDistinctFieldEnum, {
  name: "ProblemDistinctFieldEnum",
  description: undefined,
});
