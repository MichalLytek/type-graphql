import * as TypeGraphQL from "type-graphql";
import { UpdateManyUserArgs } from "./args/UpdateManyUserArgs";
import { User } from "../../../models/User";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => User)
export class UpdateManyUserResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyUserArgs): Promise<BatchPayload> {
    return ctx.prisma.user.updateMany(args);
  }
}
