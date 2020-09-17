import * as TypeGraphQL from "type-graphql";
import { DeleteProblemArgs } from "./args/DeleteProblemArgs";
import { Problem } from "../../../models/Problem";

@TypeGraphQL.Resolver(_of => Problem)
export class DeleteProblemResolver {
  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async deleteProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.delete(args);
  }
}
