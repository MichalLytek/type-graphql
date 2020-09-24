import * as TypeGraphQL from "type-graphql";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";
import { UserPostsArgs } from "./args/UserPostsArgs";

@TypeGraphQL.Resolver(_of => User)
export class UserRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [Post], {
    nullable: true,
    description: undefined,
  })
  async posts(@TypeGraphQL.Root() user: User, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UserPostsArgs): Promise<Post[] | null> {
    return ctx.prisma.user.findOne({
      where: {
        id: user.id,
      },
    }).posts(args);
  }
}
