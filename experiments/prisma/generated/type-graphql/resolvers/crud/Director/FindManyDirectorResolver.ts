import * as TypeGraphQL from "type-graphql";
import { FindManyDirectorArgs } from "./args/FindManyDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class FindManyDirectorResolver {
  @TypeGraphQL.Query(_returns => [Director], {
    nullable: false,
    description: undefined
  })
  async directors(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyDirectorArgs): Promise<Director[]> {
    return ctx.prisma.director.findMany(args);
  }
}
