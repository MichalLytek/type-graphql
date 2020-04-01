import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindOneDirectorArgs } from "./args/FindOneDirectorArgs";
import { Director } from "../../../models/Director";

@Resolver(_of => Director)
export class FindOneDirectorResolver {
  @Query(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async director(@Ctx() ctx: any, @Args() args: FindOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.findOne(args);
  }
}
