import * as TypeGraphQL from "type-graphql";
import { DeleteCreatorArgs } from "./args/DeleteCreatorArgs";
import { Creator } from "../../../models/Creator";

@TypeGraphQL.Resolver(_of => Creator)
export class DeleteCreatorResolver {
  @TypeGraphQL.Mutation(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async deleteCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.delete(args);
  }
}
