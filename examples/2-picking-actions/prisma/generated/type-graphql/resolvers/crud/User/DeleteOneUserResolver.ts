import * as TypeGraphQL from "type-graphql";
import { DeleteOneUserArgs } from "./args/DeleteOneUserArgs";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => User)
export class DeleteOneUserResolver {
  @TypeGraphQL.Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async deleteOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.delete(args);
  }
}
