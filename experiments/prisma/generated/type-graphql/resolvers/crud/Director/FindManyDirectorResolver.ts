import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindManyDirectorArgs } from "./args/FindManyDirectorArgs";
import { Director } from "../../../models/Director";

@Resolver(_of => Director)
export class FindManyDirectorResolver {
  @Query(_returns => [Director], {
    nullable: false,
    description: undefined
  })
  async directors(@Ctx() ctx: any, @Args() args: FindManyDirectorArgs): Promise<Director[]> {
    return ctx.prisma.director.findMany(args);
  }
}
