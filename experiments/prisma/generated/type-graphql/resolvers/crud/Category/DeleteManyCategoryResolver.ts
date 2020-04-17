import * as TypeGraphQL from "type-graphql";
import { DeleteManyCategoryArgs } from "./args/DeleteManyCategoryArgs";
import { Category } from "../../../models/Category";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Category)
export class DeleteManyCategoryResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.deleteMany(args);
  }
}
