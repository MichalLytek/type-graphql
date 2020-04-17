import * as TypeGraphQL from "type-graphql";
import { UpdateManyCategoryArgs } from "./args/UpdateManyCategoryArgs";
import { Category } from "../../../models/Category";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Category)
export class UpdateManyCategoryResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.updateMany(args);
  }
}
