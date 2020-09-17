import * as TypeGraphQL from "type-graphql";
import { CreateProblemArgs } from "./args/CreateProblemArgs";
import { Problem } from "../../../models/Problem";

@TypeGraphQL.Resolver(_of => Problem)
export class CreateProblemResolver {
  @TypeGraphQL.Mutation(_returns => Problem, {
    nullable: false,
    description: undefined
  })
  async createProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateProblemArgs): Promise<Problem> {
    return ctx.prisma.problem.create(args);
  }
}
