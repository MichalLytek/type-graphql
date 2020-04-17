import * as TypeGraphQL from "type-graphql";
import { DeleteOneDirectorArgs } from "./args/DeleteOneDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class DeleteOneDirectorResolver {
  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async deleteOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.delete(args);
  }
}
