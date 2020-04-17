import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneDirectorArgs } from "./args/CreateOneDirectorArgs";
import { DeleteManyDirectorArgs } from "./args/DeleteManyDirectorArgs";
import { DeleteOneDirectorArgs } from "./args/DeleteOneDirectorArgs";
import { FindManyDirectorArgs } from "./args/FindManyDirectorArgs";
import { FindOneDirectorArgs } from "./args/FindOneDirectorArgs";
import { UpdateManyDirectorArgs } from "./args/UpdateManyDirectorArgs";
import { UpdateOneDirectorArgs } from "./args/UpdateOneDirectorArgs";
import { UpsertOneDirectorArgs } from "./args/UpsertOneDirectorArgs";
import { Director } from "../../../models/Director";
import { AggregateDirector } from "../../outputs/AggregateDirector";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Director)
export class DirectorCrudResolver {
  @Query(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async director(@Ctx() ctx: any, @Args() args: FindOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.findOne(args);
  }

  @Query(_returns => [Director], {
    nullable: false,
    description: undefined
  })
  async directors(@Ctx() ctx: any, @Args() args: FindManyDirectorArgs): Promise<Director[]> {
    return ctx.prisma.director.findMany(args);
  }

  @Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async createOneDirector(@Ctx() ctx: any, @Args() args: CreateOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.create(args);
  }

  @Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async deleteOneDirector(@Ctx() ctx: any, @Args() args: DeleteOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.delete(args);
  }

  @Mutation(_returns => Director, {
    nullable: true,
    description: undefined
  })
  async updateOneDirector(@Ctx() ctx: any, @Args() args: UpdateOneDirectorArgs): Promise<Director | null> {
    return ctx.prisma.director.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyDirector(@Ctx() ctx: any, @Args() args: DeleteManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.deleteMany(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyDirector(@Ctx() ctx: any, @Args() args: UpdateManyDirectorArgs): Promise<BatchPayload> {
    return ctx.prisma.director.updateMany(args);
  }

  @Mutation(_returns => Director, {
    nullable: false,
    description: undefined
  })
  async upsertOneDirector(@Ctx() ctx: any, @Args() args: UpsertOneDirectorArgs): Promise<Director> {
    return ctx.prisma.director.upsert(args);
  }

  @Query(_returns => AggregateDirector, {
    nullable: false,
    description: undefined
  })
  async aggregateDirector(): Promise<AggregateDirector> {
    return new AggregateDirector();
  }
}
