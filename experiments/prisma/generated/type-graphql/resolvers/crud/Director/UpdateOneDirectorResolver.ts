import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateOneDirectorArgs } from "./args/UpdateOneDirectorArgs";
import { Director } from "../../../models/Director";

@Resolver(_of => Director)
export class UpdateOneDirectorResolver {
  @Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async updateOneDirector(@Ctx() ctx: any, @Args() args: UpdateOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.update(args);
  }
}
