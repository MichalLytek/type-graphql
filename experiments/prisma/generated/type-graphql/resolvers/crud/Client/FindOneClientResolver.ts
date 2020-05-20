import * as TypeGraphQL from "type-graphql";
import { FindOneClientArgs } from "./args/FindOneClientArgs";
import { Client } from "../../../models/Client";

@TypeGraphQL.Resolver(_of => Client)
export class FindOneClientResolver {
  @TypeGraphQL.Query(_returns => Client, {
    nullable: true,
    description: undefined
  })
  async client(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneClientArgs): Promise<Client | null | undefined> {
    return ctx.prisma.user.findOne(args);
  }
}
