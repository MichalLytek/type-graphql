import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindOneUserArgs } from "./args/FindOneUserArgs";
import { User } from "../../../models/User";

@Resolver(_of => User)
export class FindOneUserResolver {
  @Query(_returns => User, {
    nullable: true,
    description: undefined
  })
  async findOneUser(@Ctx() ctx: any, @Args() args: FindOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.findOne(args);
  }
}
