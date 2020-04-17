import * as TypeGraphQL from "type-graphql";
import { UserCreateOneWithoutPostsInput } from "../inputs/UserCreateOneWithoutPostsInput";
import { PostKind } from "../../enums/PostKind";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  uuid?: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  createdAt?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  updatedAt?: Date | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  published!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  title!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  content?: string | null;

  @TypeGraphQL.Field(_type => PostKind, {
    nullable: true,
    description: undefined
  })
  kind?: keyof typeof PostKind | null;

  @TypeGraphQL.Field(_type => UserCreateOneWithoutPostsInput, {
    nullable: false,
    description: undefined
  })
  author!: UserCreateOneWithoutPostsInput;
}
