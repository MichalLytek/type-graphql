import { registerEnumType, ObjectType, Field, Int, Float, Resolver, FieldResolver, Root, Ctx } from "type-graphql";
import DataLoader from "dataloader";

/**
 * Role enum comment
 */
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}
registerEnumType(Role, {
  name: "Role",
  description: "Role enum comment",
})

export enum PostKind {
  BLOG = "BLOG",
  ADVERT = "ADVERT"
}
registerEnumType(PostKind, {
  name: "PostKind",
  description: undefined,
})

/**
 * User model comment
 */
@ObjectType({
  isAbstract: true,
  description: "User model comment",
})
export class BaseUser {
  /**
   * User model field comment
   */
  @Field(_type => Int, {
    nullable: false,
    description: "User model field comment",
  })
  id!: number;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  name?: string | null;

  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  age!: number;

  @Field(_type => Float, {
    nullable: false,
    description: undefined,
  })
  balance!: number;

  @Field(_type => Float, {
    nullable: false,
    description: undefined,
  })
  amount!: number;

  posts?: BasePost[] | null;

  @Field(_type => Role, {
    nullable: false,
    description: undefined,
  })
  role!: keyof typeof Role;
}

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class BasePost {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  uuid!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  createdAt!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  updatedAt!: string;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  published!: boolean;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  title!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  content?: string | null;

  author?: BaseUser;

  @Field(_type => PostKind, {
    nullable: true,
    description: undefined,
  })
  kind?: keyof typeof PostKind | null;
}

function createUserPostsLoader(photon: any) {
  return new DataLoader<number, BasePost[] | null>(async keys => {
    const fetchedData: any[] = await photon.users.findMany({
      where: { id: { in: keys } },
      select: { id: true, posts: true },
    });
    return keys
      .map(key => fetchedData.find(data => data.id === key)!)
      .map(data => data.posts);
  });
}

@Resolver(_of => BaseUser)
export class UserRelationsResolver {
  @FieldResolver(_type => [BasePost], {
    nullable: true,
    description: undefined,
  })
  async posts(@Root() user: BaseUser, @Ctx() ctx: any): Promise<BasePost[] | null> {
    ctx.userPostsLoader = ctx.userPostsLoader || createUserPostsLoader(ctx.photon);
    return ctx.userPostsLoader.load(user.id);
  }
}

function createPostAuthorLoader(photon: any) {
  return new DataLoader<string, BaseUser>(async keys => {
    const fetchedData: any[] = await photon.posts.findMany({
      where: { uuid: { in: keys } },
      select: { uuid: true, author: true },
    });
    return keys
      .map(key => fetchedData.find(data => data.uuid === key)!)
      .map(data => data.author);
  });
}

@Resolver(_of => BasePost)
export class PostRelationsResolver {
  @FieldResolver(_type => BaseUser, {
    nullable: false,
    description: undefined,
  })
  async author(@Root() post: BasePost, @Ctx() ctx: any): Promise<BaseUser> {
    ctx.postAuthorLoader = ctx.postAuthorLoader || createPostAuthorLoader(ctx.photon);
    return ctx.postAuthorLoader.load(post.uuid);
  }
}
