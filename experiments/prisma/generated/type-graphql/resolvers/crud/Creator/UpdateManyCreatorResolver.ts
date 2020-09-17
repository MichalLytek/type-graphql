import * as TypeGraphQL from "type-graphql";
import { UpdateManyCreatorArgs } from "./args/UpdateManyCreatorArgs";
import { Creator } from "../../../models/Creator";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Creator)
export class UpdateManyCreatorResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyCreatorArgs): Promise<BatchPayload> {
    return ctx.prisma.creator.updateMany(args);
  }
}
