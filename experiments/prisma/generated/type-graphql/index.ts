import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import DataLoader from "dataloader";

function createGetUserPostsDataLoader(photon: any) {
  const argsToDataLoaderMap = new Map<string, DataLoader<number, Post[] | null>>();
  return function getUserPostsDataLoader(args: any) {
    const argsJSON = JSON.stringify(args);
    let userPostsDataLoader = argsToDataLoaderMap.get(argsJSON);
    if (!userPostsDataLoader) {
      userPostsDataLoader = new DataLoader<number, Post[] | null>(async keys => {
        const fetchedData: any[] = await photon.users.findMany({
          where: { id: { in: keys } },
          select: {
            id: true,
            posts: args,
          },
        });
        return keys
          .map(key => fetchedData.find(data => data.id === key)!)
          .map(data => data.posts);
      });
      argsToDataLoaderMap.set(argsJSON, userPostsDataLoader);
    }
    return userPostsDataLoader;
  }

}

@ArgsType()
export class UserPostsArgs {
  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;

  @Field(_type => PostOrderByInput, { nullable: true })
  orderBy?: PostOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => ID, { nullable: true })
  after?: string | null;

  @Field(_type => ID, { nullable: true })
  before?: string | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}

@Resolver(_of => User)
export class UserRelationsResolver {
  @FieldResolver(_type => [Post], {
    nullable: true,
    description: undefined,
  })
  async posts(@Root() user: User, @Ctx() ctx: any, @Args() args: UserPostsArgs): Promise<Post[] | null> {
    ctx.getUserPostsDataLoader = ctx.getUserPostsDataLoader || createGetUserPostsDataLoader(ctx.photon);
    return ctx.getUserPostsDataLoader(args).load(user.id);
  }
}

function createGetPostAuthorDataLoader(photon: any) {
  const argsToDataLoaderMap = new Map<string, DataLoader<string, User>>();
  return function getPostAuthorDataLoader(args: any) {
    const argsJSON = JSON.stringify(args);
    let postAuthorDataLoader = argsToDataLoaderMap.get(argsJSON);
    if (!postAuthorDataLoader) {
      postAuthorDataLoader = new DataLoader<string, User>(async keys => {
        const fetchedData: any[] = await photon.posts.findMany({
          where: { uuid: { in: keys } },
          select: {
            uuid: true,
            author: args,
          },
        });
        return keys
          .map(key => fetchedData.find(data => data.uuid === key)!)
          .map(data => data.author);
      });
      argsToDataLoaderMap.set(argsJSON, postAuthorDataLoader);
    }
    return postAuthorDataLoader;
  }

}

@Resolver(_of => Post)
export class PostRelationsResolver {
  @FieldResolver(_type => User, {
    nullable: false,
    description: undefined,
  })
  async author(@Root() post: Post, @Ctx() ctx: any): Promise<User> {
    ctx.getPostAuthorDataLoader = ctx.getPostAuthorDataLoader || createGetPostAuthorDataLoader(ctx.photon);
    return ctx.getPostAuthorDataLoader({}).load(post.uuid);
  }
}

@ArgsType()
export class FindOneUserArgs {
  @Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;
}

@ArgsType()
export class FindManyUserArgs {
  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;

  @Field(_type => UserOrderByInput, { nullable: true })
  orderBy?: UserOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => Int, { nullable: true })
  after?: number | null;

  @Field(_type => Int, { nullable: true })
  before?: number | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}

@ArgsType()
export class CreateOneUserArgs {
  @Field(_type => UserCreateInput, { nullable: false })
  data!: UserCreateInput;
}

@ArgsType()
export class DeleteOneUserArgs {
  @Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;
}

@ArgsType()
export class UpdateOneUserArgs {
  @Field(_type => UserUpdateInput, { nullable: false })
  data!: UserUpdateInput;

  @Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;
}

@ArgsType()
export class UpdateManyUserArgs {
  @Field(_type => UserUpdateManyMutationInput, { nullable: false })
  data!: UserUpdateManyMutationInput;

  @Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;
}

@ArgsType()
export class UpsertOneUserArgs {
  @Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;

  @Field(_type => UserCreateInput, { nullable: false })
  create!: UserCreateInput;

  @Field(_type => UserUpdateInput, { nullable: false })
  update!: UserUpdateInput;
}

@Resolver(_of => User)
export class UserCrudResolver {
  @Query(_returns => User, {
    nullable: true,
    description: undefined
  })
  async findOneUser(@Ctx() ctx: any, @Args() args: FindOneUserArgs): Promise<User | null> {
    return ctx.photon.users.findOne(args);
  }

  @Query(_returns => [User], {
    nullable: true,
    description: undefined
  })
  async findManyUser(@Ctx() ctx: any, @Args() args: FindManyUserArgs): Promise<User[] | null> {
    return ctx.photon.users.findMany(args);
  }

  @Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async createOneUser(@Ctx() ctx: any, @Args() args: CreateOneUserArgs): Promise<User> {
    return ctx.photon.users.create(args);
  }

  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async deleteOneUser(@Ctx() ctx: any, @Args() args: DeleteOneUserArgs): Promise<User | null> {
    return ctx.photon.users.delete(args);
  }

  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async updateOneUser(@Ctx() ctx: any, @Args() args: UpdateOneUserArgs): Promise<User | null> {
    return ctx.photon.users.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyUser(@Ctx() ctx: any, @Args() args: UpdateManyUserArgs): Promise<BatchPayload> {
    return ctx.photon.users.updateMany(args);
  }

  @Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async upsertOneUser(@Ctx() ctx: any, @Args() args: UpsertOneUserArgs): Promise<User> {
    return ctx.photon.users.upsert(args);
  }

  @Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined
  })
  async aggregateUser(@Ctx() ctx: any): Promise<AggregateUser> {
    return ctx.photon.users.aggregate();
  }
}

@ArgsType()
export class FindOnePostArgs {
  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;
}

@ArgsType()
export class FindManyPostArgs {
  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;

  @Field(_type => PostOrderByInput, { nullable: true })
  orderBy?: PostOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => ID, { nullable: true })
  after?: string | null;

  @Field(_type => ID, { nullable: true })
  before?: string | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}

@ArgsType()
export class CreateOnePostArgs {
  @Field(_type => PostCreateInput, { nullable: false })
  data!: PostCreateInput;
}

@ArgsType()
export class DeleteOnePostArgs {
  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;
}

@ArgsType()
export class UpdateOnePostArgs {
  @Field(_type => PostUpdateInput, { nullable: false })
  data!: PostUpdateInput;

  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;
}

@ArgsType()
export class UpdateManyPostArgs {
  @Field(_type => PostUpdateManyMutationInput, { nullable: false })
  data!: PostUpdateManyMutationInput;

  @Field(_type => PostWhereInput, { nullable: true })
  where?: PostWhereInput | null;
}

@ArgsType()
export class UpsertOnePostArgs {
  @Field(_type => PostWhereUniqueInput, { nullable: false })
  where!: PostWhereUniqueInput;

  @Field(_type => PostCreateInput, { nullable: false })
  create!: PostCreateInput;

  @Field(_type => PostUpdateInput, { nullable: false })
  update!: PostUpdateInput;
}

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
    nullable: true,
    description: undefined
  })
  async findManyPost(@Ctx() ctx: any, @Args() args: FindManyPostArgs): Promise<Post[] | null> {
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
