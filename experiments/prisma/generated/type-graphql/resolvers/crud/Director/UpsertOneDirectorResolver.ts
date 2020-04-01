import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpsertOneDirectorArgs } from "./args/UpsertOneDirectorArgs";
import { Director } from "../../../models/Director";

@Resolver(_of => Director)
export class UpsertOneDirectorResolver {
  @Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async upsertOneDirector(@Ctx() ctx: any, @Args() args: UpsertOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.upsert(args);
  }
}
