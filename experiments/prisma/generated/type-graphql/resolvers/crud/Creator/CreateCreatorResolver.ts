import * as TypeGraphQL from "type-graphql";
import { CreateCreatorArgs } from "./args/CreateCreatorArgs";
import { Creator } from "../../../models/Creator";

@TypeGraphQL.Resolver(_of => Creator)
export class CreateCreatorResolver {
  @TypeGraphQL.Mutation(_returns => Creator, {
    nullable: false,
    description: undefined
  })
  async createCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateCreatorArgs): Promise<Creator> {
    return ctx.prisma.creator.create(args);
  }
}
