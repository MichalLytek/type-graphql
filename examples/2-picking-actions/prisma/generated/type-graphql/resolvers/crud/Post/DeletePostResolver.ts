import * as TypeGraphQL from "type-graphql";
import { DeletePostArgs } from "./args/DeletePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class DeletePostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async deletePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeletePostArgs): Promise<Post | null> {
    return ctx.prisma.post.delete(args);
  }
}
