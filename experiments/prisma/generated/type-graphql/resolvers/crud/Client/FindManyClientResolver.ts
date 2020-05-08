import * as TypeGraphQL from "type-graphql";
import { FindManyClientArgs } from "./args/FindManyClientArgs";
import { Client } from "../../../models/Client";

@TypeGraphQL.Resolver(_of => Client)
export class FindManyClientResolver {
  @TypeGraphQL.Query(_returns => [Client], {
    nullable: false,
    description: undefined
  })
  async clients(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyClientArgs): Promise<Client[]> {
    return ctx.prisma.user.findMany(args);
  }
}
