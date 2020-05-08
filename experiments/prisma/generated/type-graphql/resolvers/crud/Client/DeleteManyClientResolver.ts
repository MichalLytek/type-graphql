import * as TypeGraphQL from "type-graphql";
import { DeleteManyClientArgs } from "./args/DeleteManyClientArgs";
import { Client } from "../../../models/Client";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Client)
export class DeleteManyClientResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyClientArgs): Promise<BatchPayload> {
    return ctx.prisma.user.deleteMany(args);
  }
}
