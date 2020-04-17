import * as TypeGraphQL from "type-graphql";
import { CreateOneUserArgs } from "./args/CreateOneUserArgs";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => User)
export class CreateOneUserResolver {
  @TypeGraphQL.Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async createOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneUserArgs): Promise<User> {
    return ctx.prisma.user.create(args);
  }
}
