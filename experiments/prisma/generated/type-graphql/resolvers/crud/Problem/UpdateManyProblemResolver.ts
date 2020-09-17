import * as TypeGraphQL from "type-graphql";
import { UpdateManyProblemArgs } from "./args/UpdateManyProblemArgs";
import { Problem } from "../../../models/Problem";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Problem)
export class UpdateManyProblemResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyProblem(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyProblemArgs): Promise<BatchPayload> {
    return ctx.prisma.problem.updateMany(args);
  }
}
