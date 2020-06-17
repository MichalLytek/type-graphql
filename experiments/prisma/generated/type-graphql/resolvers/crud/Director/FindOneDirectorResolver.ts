import * as TypeGraphQL from "type-graphql";
import { FindOneDirectorArgs } from "./args/FindOneDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class FindOneDirectorResolver {
  @TypeGraphQL.Query(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async director(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneDirectorArgs): Promise<Director | undefined> {
    return ctx.prisma.director.findOne(args);
  }
}
