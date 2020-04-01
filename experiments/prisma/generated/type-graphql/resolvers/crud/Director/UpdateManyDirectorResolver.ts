import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateManyDirectorArgs } from "./args/UpdateManyDirectorArgs";
import { Director } from "../../../models/Director";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Director)
export class UpdateManyDirectorResolver {
  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyDirector(@Ctx() ctx: any, @Args() args: UpdateManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.updateMany(args);
  }
}
