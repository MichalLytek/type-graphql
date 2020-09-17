import * as TypeGraphQL from "type-graphql";
import { UpdateCreatorArgs } from "./args/UpdateCreatorArgs";
import { Creator } from "../../../models/Creator";

@TypeGraphQL.Resolver(_of => Creator)
export class UpdateCreatorResolver {
  @TypeGraphQL.Mutation(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async updateCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.update(args);
  }
}
