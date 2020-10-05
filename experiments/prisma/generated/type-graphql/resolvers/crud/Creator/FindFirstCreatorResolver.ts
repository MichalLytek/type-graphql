import * as TypeGraphQL from "type-graphql";
import { FindFirstCreatorArgs } from "./args/FindFirstCreatorArgs";
import { Creator } from "../../../models/Creator";

@TypeGraphQL.Resolver(_of => Creator)
export class FindFirstCreatorResolver {
  @TypeGraphQL.Query(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async findFirstCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.findFirst(args);
  }
}
