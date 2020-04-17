import * as TypeGraphQL from "type-graphql";
import { UpdateOneUserArgs } from "./args/UpdateOneUserArgs";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => User)
export class UpdateOneUserResolver {
  @TypeGraphQL.Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async updateOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.update(args);
  }
}
