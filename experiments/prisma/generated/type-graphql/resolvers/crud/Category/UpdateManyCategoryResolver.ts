import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateManyCategoryArgs } from "./args/UpdateManyCategoryArgs";
import { Category } from "../../../models/Category";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Category)
export class UpdateManyCategoryResolver {
  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyCategory(@Ctx() ctx: any, @Args() args: UpdateManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.updateMany(args);
  }
}
