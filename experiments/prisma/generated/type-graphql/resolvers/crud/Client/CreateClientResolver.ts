import * as TypeGraphQL from "type-graphql";
import { CreateClientArgs } from "./args/CreateClientArgs";
import { Client } from "../../../models/Client";

@TypeGraphQL.Resolver(_of => Client)
export class CreateClientResolver {
  @TypeGraphQL.Mutation(_returns => Client, {
    nullable: false,
    description: undefined
  })
  async createClient(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateClientArgs): Promise<Client> {
    return ctx.prisma.user.create(args);
  }
}
