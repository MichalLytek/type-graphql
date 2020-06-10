import * as TypeGraphQL from "type-graphql";
import { UpsertUserArgs } from "./args/UpsertUserArgs";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => User)
export class UpsertUserResolver {
  @TypeGraphQL.Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async upsertUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertUserArgs): Promise<User> {
    return ctx.prisma.user.upsert(args);
  }
}
