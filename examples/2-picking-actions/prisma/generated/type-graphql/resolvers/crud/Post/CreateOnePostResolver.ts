import * as TypeGraphQL from "type-graphql";
import { CreateOnePostArgs } from "./args/CreateOnePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class CreateOnePostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async createOnePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOnePostArgs): Promise<Post> {
    return ctx.prisma.post.create(args);
  }
}
