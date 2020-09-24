import * as TypeGraphQL from "type-graphql";
import { DeleteUserArgs } from "./args/DeleteUserArgs";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => User)
export class DeleteUserResolver {
  @TypeGraphQL.Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async deleteUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteUserArgs): Promise<User | null> {
    return ctx.prisma.user.delete(args);
  }
}
