import * as TypeGraphQL from "type-graphql";
import { UpdatePostArgs } from "./args/UpdatePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class UpdatePostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async updatePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdatePostArgs): Promise<Post | null> {
    return ctx.prisma.post.update(args);
  }
}
