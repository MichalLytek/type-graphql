import * as TypeGraphQL from "type-graphql";
import { FindOnePostArgs } from "./args/FindOnePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class FindOnePostResolver {
  @TypeGraphQL.Query(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async post(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.findOne(args);
  }
}
