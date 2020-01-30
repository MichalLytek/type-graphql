import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpsertOneUserArgs } from "./args/UpsertOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class UpsertOneUserResolver {
  @Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async upsertOneUser(@Ctx() ctx: any, @Args() args: UpsertOneUserArgs): Promise<User> {
    return ctx.prisma.user.upsert(args);
  }
}
