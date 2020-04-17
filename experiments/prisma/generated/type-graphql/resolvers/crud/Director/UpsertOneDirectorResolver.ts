import * as TypeGraphQL from "type-graphql";
import { UpsertOneDirectorArgs } from "./args/UpsertOneDirectorArgs";
import { Director } from "../../../models/Director";

@TypeGraphQL.Resolver(_of => Director)
export class UpsertOneDirectorResolver {
  @TypeGraphQL.Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async upsertOneDirector(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.upsert(args);
  }
}
