import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteOneUserArgs } from "./args/DeleteOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class DeleteOneUserResolver {
  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async deleteOneUser(@Ctx() ctx: any, @Args() args: DeleteOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.delete(args);
  }
}
