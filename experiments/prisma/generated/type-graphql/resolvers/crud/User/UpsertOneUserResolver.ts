import * as TypeGraphQL from "type-graphql";
import { UpsertOneUserArgs } from "./args/UpsertOneUserArgs";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => User)
export class UpsertOneUserResolver {
  @TypeGraphQL.Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async upsertOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneUserArgs): Promise<User> {
    return ctx.prisma.user.upsert(args);
  }
}
