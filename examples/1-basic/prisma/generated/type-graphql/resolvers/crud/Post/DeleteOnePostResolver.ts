import * as TypeGraphQL from "type-graphql";
import { DeleteOnePostArgs } from "./args/DeleteOnePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class DeleteOnePostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async deleteOnePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.delete(args);
  }
}
