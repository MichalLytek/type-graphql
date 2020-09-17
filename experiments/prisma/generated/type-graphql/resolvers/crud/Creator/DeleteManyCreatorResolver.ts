import * as TypeGraphQL from "type-graphql";
import { DeleteManyCreatorArgs } from "./args/DeleteManyCreatorArgs";
import { Creator } from "../../../models/Creator";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Creator)
export class DeleteManyCreatorResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyCreatorArgs): Promise<BatchPayload> {
    return ctx.prisma.creator.deleteMany(args);
  }
}
