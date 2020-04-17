import * as TypeGraphQL from "type-graphql";
import { UpdateOneDirectorArgs } from "./args/UpdateOneDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class UpdateOneDirectorResolver {
  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async updateOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.update(args);
  }
}
