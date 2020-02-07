import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneUserArgs } from "./args/CreateOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class CreateOneUserResolver {
  @Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async createOneUser(@Ctx() ctx: any, @Args() args: CreateOneUserArgs): Promise<User> {
    return ctx.prisma.user.create(args);
  }
}
