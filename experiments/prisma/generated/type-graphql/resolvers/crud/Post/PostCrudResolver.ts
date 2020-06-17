import * as TypeGraphQL from "type-graphql";
import { CreatePostArgs } from "./args/CreatePostArgs";
import { DeleteManyPostArgs } from "./args/DeleteManyPostArgs";
import { DeletePostArgs } from "./args/DeletePostArgs";
import { FindManyPostArgs } from "./args/FindManyPostArgs";
import { FindOnePostArgs } from "./args/FindOnePostArgs";
import { UpdateManyPostArgs } from "./args/UpdateManyPostArgs";
import { UpdatePostArgs } from "./args/UpdatePostArgs";
import { UpsertPostArgs } from "./args/UpsertPostArgs";
import { Post } from "../../../models/Post";
import { AggregatePost } from "../../outputs/AggregatePost";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Post)
export class PostCrudResolver {
  @TypeGraphQL.Query(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async post(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOnePostArgs): Promise<Post | undefined> {
    return ctx.prisma.post.findOne(args);
  }

  @TypeGraphQL.Query(_returns => [Post], {
    nullable: false,
    description: undefined
  })
  async posts(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyPostArgs): Promise<Post[]> {
    return ctx.prisma.post.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async createPost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreatePostArgs): Promise<Post> {
    return ctx.prisma.post.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async deletePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeletePostArgs): Promise<Post | undefined> {
    return ctx.prisma.post.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async updatePost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdatePostArgs): Promise<Post | undefined> {
    return ctx.prisma.post.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyPost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyPostArgs): Promise<BatchPayload> {
    return ctx.prisma.post.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyPost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyPostArgs): Promise<BatchPayload> {
    return ctx.prisma.post.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async upsertPost(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertPostArgs): Promise<Post> {
    return ctx.prisma.post.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregatePost, {
    nullable: false,
    description: undefined
  })
  async aggregatePost(): Promise<AggregatePost> {
    return new AggregatePost();
  }
}
