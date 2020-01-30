import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOnePostArgs } from "./args/CreateOnePostArgs";
import { DeleteManyPostArgs } from "./args/DeleteManyPostArgs";
import { DeleteOnePostArgs } from "./args/DeleteOnePostArgs";
import { FindManyPostArgs } from "./args/FindManyPostArgs";
import { FindOnePostArgs } from "./args/FindOnePostArgs";
import { UpdateManyPostArgs } from "./args/UpdateManyPostArgs";
import { UpdateOnePostArgs } from "./args/UpdateOnePostArgs";
import { UpsertOnePostArgs } from "./args/UpsertOnePostArgs";
import { Post } from "../../../models/Post";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Post)
export class PostCrudResolver {
  @Query(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async findOnePost(@Ctx() ctx: any, @Args() args: FindOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.findOne(args);
  }

  @Query(_returns => [Post], {
    nullable: false,
    description: undefined
  })
  async findManyPost(@Ctx() ctx: any, @Args() args: FindManyPostArgs): Promise<Post[]> {
    return ctx.prisma.post.findMany(args);
  }

  @Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async createOnePost(@Ctx() ctx: any, @Args() args: CreateOnePostArgs): Promise<Post> {
    return ctx.prisma.post.create(args);
  }

  @Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async deleteOnePost(@Ctx() ctx: any, @Args() args: DeleteOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.delete(args);
  }

  @Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async updateOnePost(@Ctx() ctx: any, @Args() args: UpdateOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyPost(@Ctx() ctx: any, @Args() args: DeleteManyPostArgs): Promise<BatchPayload> {
    return ctx.prisma.post.deleteMany(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyPost(@Ctx() ctx: any, @Args() args: UpdateManyPostArgs): Promise<BatchPayload> {
    return ctx.prisma.post.updateMany(args);
  }

  @Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async upsertOnePost(@Ctx() ctx: any, @Args() args: UpsertOnePostArgs): Promise<Post> {
    return ctx.prisma.post.upsert(args);
  }
}
