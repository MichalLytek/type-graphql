import * as TypeGraphQL from "type-graphql";
import { FindOneUserArgs } from "./args/FindOneUserArgs";
import { User } from "../../../models/User";

@TypeGraphQL.Resolver(_of => User)
export class FindOneUserResolver {
  @TypeGraphQL.Query(_returns => User, {
    nullable: true,
    description: undefined
  })
  async user(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.findOne(args);
  }
}
