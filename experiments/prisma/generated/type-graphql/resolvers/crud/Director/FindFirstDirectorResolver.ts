import * as TypeGraphQL from "type-graphql";
import { FindFirstDirectorArgs } from "./args/FindFirstDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class FindFirstDirectorResolver {
  @TypeGraphQL.Query(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async findFirstDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.findFirst(args);
  }
}
