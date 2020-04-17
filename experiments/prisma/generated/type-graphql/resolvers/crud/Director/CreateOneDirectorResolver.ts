import * as TypeGraphQL from "type-graphql";
import { CreateOneDirectorArgs } from "./args/CreateOneDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class CreateOneDirectorResolver {
  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async createOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.create(args);
  }
}
