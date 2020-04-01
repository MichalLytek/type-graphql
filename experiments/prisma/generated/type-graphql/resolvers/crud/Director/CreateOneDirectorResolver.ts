import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneDirectorArgs } from "./args/CreateOneDirectorArgs";
import { Director } from "../../../models/Director";

@Resolver(_of => Director)
export class CreateOneDirectorResolver {
  @Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async createOneDirector(@Ctx() ctx: any, @Args() args: CreateOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.create(args);
  }
}
