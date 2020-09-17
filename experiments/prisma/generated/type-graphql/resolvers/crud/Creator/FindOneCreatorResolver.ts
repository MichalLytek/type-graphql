import * as TypeGraphQL from "type-graphql";
import { FindOneCreatorArgs } from "./args/FindOneCreatorArgs";
import { Creator } from "../../../models/Creator";

@TypeGraphQL.Resolver(_of => Creator)
export class FindOneCreatorResolver {
  @TypeGraphQL.Query(_returns => Creator, {
    nullable: true,
    description: undefined
  })
  async creator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneCreatorArgs): Promise<Creator | null> {
    return ctx.prisma.creator.findOne(args);
  }
}
