import * as TypeGraphQL from "type-graphql";
import { UpdateOnePostArgs } from "./args/UpdateOnePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class UpdateOnePostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async updateOnePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.update(args);
  }
}
