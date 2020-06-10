import * as TypeGraphQL from "type-graphql";
import { UpsertPostArgs } from "./args/UpsertPostArgs";
import { Post } from "../../../models/Post";

@TypeGraphQL.Resolver(_of => Post)
export class UpsertPostResolver {
  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async upsertPost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertPostArgs): Promise<Post> {
    return ctx.prisma.post.upsert(args);
  }
}
