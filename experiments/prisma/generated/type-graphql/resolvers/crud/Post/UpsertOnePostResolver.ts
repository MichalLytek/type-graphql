import * as TypeGraphQL from "type-graphql";
import { UpsertOnePostArgs } from "./args/UpsertOnePostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class UpsertOnePostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async upsertOnePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOnePostArgs): Promise<Post> {
    return ctx.prisma.post.upsert(args);
  }
}
