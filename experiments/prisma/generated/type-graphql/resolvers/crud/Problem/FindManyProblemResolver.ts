import * as TypeGraphQL from "type-graphql";
import { FindManyProblemArgs } from "./args/FindManyProblemArgs";
import { Problem } from "../../../models/Problem";

@TypeGraphQL.Resolver(_of => Problem)
export class FindManyProblemResolver {
  @TypeGraphQL.Query(_returns => [Problem], {
    nullable: false,
    description: undefined
  })
  async problems(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyProblemArgs): Promise<Problem[]> {
    return ctx.prisma.problem.findMany(args);
  }
}
