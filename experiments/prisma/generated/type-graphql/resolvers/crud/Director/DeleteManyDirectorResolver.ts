import * as TypeGraphQL from "type-graphql";
import { DeleteManyDirectorArgs } from "./args/DeleteManyDirectorArgs";
import { Director } from "../../../models/Director";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Director)
export class DeleteManyDirectorResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.deleteMany(args);
  }
}
