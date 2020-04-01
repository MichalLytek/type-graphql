import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteManyDirectorArgs } from "./args/DeleteManyDirectorArgs";
import { Director } from "../../../models/Director";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Director)
export class DeleteManyDirectorResolver {
  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyDirector(@Ctx() ctx: any, @Args() args: DeleteManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.deleteMany(args);
  }
}
