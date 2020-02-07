import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateOneUserArgs } from "./args/UpdateOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class UpdateOneUserResolver {
  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async updateOneUser(@Ctx() ctx: any, @Args() args: UpdateOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.update(args);
  }
}
