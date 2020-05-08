import * as TypeGraphQL from "type-graphql";
import { CreatePostArgs } from "./args/CreatePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class CreatePostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async createPost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreatePostArgs): Promise<Post> {
    return ctx.prisma.post.create(args);
  }
}
