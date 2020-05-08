import * as TypeGraphQL from "type-graphql";
import { UpdateManyClientArgs } from "./args/UpdateManyClientArgs";
import { Client } from "../../../models/Client";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Client)
export class UpdateManyClientResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyClientArgs): Promise<BatchPayload> {
    return ctx.prisma.user.updateMany(args);
  }
}
