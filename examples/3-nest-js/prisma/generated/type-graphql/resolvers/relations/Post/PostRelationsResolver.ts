import * as TypeGraphQL from "type-graphql";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => Post)
export class PostRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => User, {
    nullable: true,
    description: undefined,
  })
  async author(@TypeGraphQL.Root() post: Post, @TypeGraphQL.Ctx() ctx: any): Promise<User | null> {
    return ctx.prisma.post.findOne({
      where: {
        id: post.id,
      },
    }).author({});
  }
}
