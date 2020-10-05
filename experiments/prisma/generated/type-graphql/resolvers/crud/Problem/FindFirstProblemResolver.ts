import * as TypeGraphQL from "type-graphql";
import { FindFirstProblemArgs } from "./args/FindFirstProblemArgs";
import { Problem } from "../../../models/Problem";

@TypeGraphQL.Resolver(_of => Problem)
export class FindFirstProblemResolver {
  @TypeGraphQL.Query(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async findFirstProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.findFirst(args);
  }
}
