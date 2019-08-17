import { Field, ObjectType, Int, Float, registerEnumType } from "type-graphql";

/**
 * Role enum comment
 */
export enum Role {
  USER,
  ADMIN
}
registerEnumType(Role, {
  name: "Role",
  description: "Role enum comment",
})

export enum PostKind {
  BLOG,
  ADVERT
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
  @Field(() => String, {
    nullable: false,
    description: "User model field comment",
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  name?: string;

  @Field(() => Int, {
    nullable: false,
    description: undefined,
  })
  age!: number;

  @Field(() => Float, {
    nullable: false,
    description: undefined,
  })
  balance!: number;

  @Field(() => Float, {
    nullable: false,
    description: undefined,
  })
  amount!: number;

  @Field(() => [BasePost], {
    nullable: true,
    description: undefined,
  })
  posts?: BasePost[];

  @Field(() => Role, {
    nullable: false,
    description: undefined,
  })
  role!: Role;
}

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class BasePost {
  @Field(() => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined,
  })
  updatedAt!: Date;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined,
  })
  published!: boolean;

  @Field(() => String, {
    nullable: false,
    description: undefined,
  })
  title!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  content?: string;

  @Field(() => BaseUser, {
    nullable: true,
    description: undefined,
  })
  author?: BaseUser;

  @Field(() => PostKind, {
    nullable: true,
    description: undefined,
  })
  kind?: PostKind;
}
