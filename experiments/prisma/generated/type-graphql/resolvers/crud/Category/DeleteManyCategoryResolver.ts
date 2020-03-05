import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteManyCategoryArgs } from "./args/DeleteManyCategoryArgs";
import { Category } from "../../../models/Category";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Category)
export class DeleteManyCategoryResolver {
  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyCategory(@Ctx() ctx: any, @Args() args: DeleteManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.deleteMany(args);
  }
}
