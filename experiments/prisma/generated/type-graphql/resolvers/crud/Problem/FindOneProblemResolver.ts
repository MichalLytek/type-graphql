import * as TypeGraphQL from "type-graphql";
import { FindOneProblemArgs } from "./args/FindOneProblemArgs";
import { Problem } from "../../../models/Problem";

@TypeGraphQL.Resolver(_of => Problem)
export class FindOneProblemResolver {
  @TypeGraphQL.Query(_returns => Problem, {
    nullable: true,
    description: undefined
  })
  async problem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneProblemArgs): Promise<Problem | null> {
    return ctx.prisma.problem.findOne(args);
  }
}
