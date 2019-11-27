import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOnePostArgs } from "./args/CreateOnePostArgs";
import { DeleteOnePostArgs } from "./args/DeleteOnePostArgs";
import { FindManyPostArgs } from "./args/FindManyPostArgs";
import { FindOnePostArgs } from "./args/FindOnePostArgs";
import { UpdateManyPostArgs } from "./args/UpdateManyPostArgs";
import { UpdateOnePostArgs } from "./args/UpdateOnePostArgs";
import { UpsertOnePostArgs } from "./args/UpsertOnePostArgs";
import { Post } from "../../../models/Post";
import { AggregatePost } from "../../outputs/AggregatePost";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Post)
export class PostCrudResolver {
  @Query(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async findOnePost(@Ctx() ctx: any, @Args() args: FindOnePostArgs): Promise<Post | null> {
    return ctx.photon.posts.findOne(args);
  }

  @Query(_returns => [Post], {
    nullable: false,
    description: undefined
  })
  async findManyPost(@Ctx() ctx: any, @Args() args: FindManyPostArgs): Promise<Post[]> {
    return ctx.photon.posts.findMany(args);
  }

  @Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async createOnePost(@Ctx() ctx: any, @Args() args: CreateOnePostArgs): Promise<Post> {
    return ctx.photon.posts.create(args);
  }

  @Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async deleteOnePost(@Ctx() ctx: any, @Args() args: DeleteOnePostArgs): Promise<Post | null> {
    return ctx.photon.posts.delete(args);
  }

  @Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async updateOnePost(@Ctx() ctx: any, @Args() args: UpdateOnePostArgs): Promise<Post | null> {
    return ctx.photon.posts.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyPost(@Ctx() ctx: any, @Args() args: UpdateManyPostArgs): Promise<BatchPayload> {
    return ctx.photon.posts.updateMany(args);
  }

  @Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async upsertOnePost(@Ctx() ctx: any, @Args() args: UpsertOnePostArgs): Promise<Post> {
    return ctx.photon.posts.upsert(args);
  }

  @Query(_returns => AggregatePost, {
    nullable: false,
    description: undefined
  })
  async aggregatePost(@Ctx() ctx: any): Promise<AggregatePost> {
    return ctx.photon.posts.aggregate();
  }
}
