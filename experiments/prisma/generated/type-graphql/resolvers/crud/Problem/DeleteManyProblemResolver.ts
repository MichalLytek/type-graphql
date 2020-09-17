import * as TypeGraphQL from "type-graphql";
import { DeleteManyProblemArgs } from "./args/DeleteManyProblemArgs";
import { Problem } from "../../../models/Problem";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Problem)
export class DeleteManyProblemResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyProblemArgs): Promise<BatchPayload> {
    return ctx.prisma.problem.deleteMany(args);
  }
}
