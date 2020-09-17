import * as TypeGraphQL from "type-graphql";
import { UpsertProblemArgs } from "./args/UpsertProblemArgs";
import { Problem } from "../../../models/Problem";

@TypeGraphQL.Resolver(_of => Problem)
export class UpsertProblemResolver {
  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: false,
    description: undefined
  })
  async upsertProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertProblemArgs): Promise<Problem> {
    return ctx.prisma.problem.upsert(args);
  }
}
