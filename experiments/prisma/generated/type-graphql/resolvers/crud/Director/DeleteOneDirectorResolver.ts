import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteOneDirectorArgs } from "./args/DeleteOneDirectorArgs";
import { Director } from "../../../models/Director";

@Resolver(_of => Director)
export class DeleteOneDirectorResolver {
  @Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async deleteOneDirector(@Ctx() ctx: any, @Args() args: DeleteOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.delete(args);
  }
}
