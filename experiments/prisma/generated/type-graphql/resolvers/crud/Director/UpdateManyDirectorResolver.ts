import * as TypeGraphQL from "type-graphql";
import { UpdateManyDirectorArgs } from "./args/UpdateManyDirectorArgs";
import { Director } from "../../../models/Director";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Director)
export class UpdateManyDirectorResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.updateMany(args);
  }
}
