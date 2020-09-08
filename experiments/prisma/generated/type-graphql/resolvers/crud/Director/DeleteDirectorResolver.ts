import * as TypeGraphQL from "type-graphql";
import { DeleteDirectorArgs } from "./args/DeleteDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class DeleteDirectorResolver {
  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async deleteDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.delete(args);
  }
}
