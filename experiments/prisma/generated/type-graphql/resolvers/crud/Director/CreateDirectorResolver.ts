import * as TypeGraphQL from "type-graphql";
import { CreateDirectorArgs } from "./args/CreateDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class CreateDirectorResolver {
  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async createDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateDirectorArgs): Promise<Director> {
    return ctx.prisma.director.create(args);
  }
}
