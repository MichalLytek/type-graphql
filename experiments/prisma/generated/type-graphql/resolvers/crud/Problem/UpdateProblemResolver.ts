import * as TypeGraphQL from "type-graphql";
import { UpdateProblemArgs } from "./args/UpdateProblemArgs";
import { Problem } from "../../../models/Problem";

@TypeGraphQL.Resolver(_of => Problem)
export class UpdateProblemResolver {
  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async updateProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.update(args);
  }
}
